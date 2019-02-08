/* eslint-disable @typescript-eslint/camelcase */

import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import StateCore from "markdown-it/lib/rules_core/state_core";
import { getAttributeName } from "../parser/parser";

const STRING_CHAR_CODE = 0x20;

type CustomSyntaxRule = "color" | "text-decoration" | "background-color";

const tagRule = /{![a-zA-Z][a-zA-Z0-9]*\} /;

const rules: Array<[CustomSyntaxRule, RegExp]> = [
  ["color", /\{color:(([a-zA-Z]*)|#([0-9a-fA-F]*))\}/],
  ["text-decoration", /\{text-decoration:(underline|line-through)\}/],
  ["background-color", /\{background-color:(([a-zA-Z]*)|#([0-9a-fA-F]*))\}/],
];

// #region Renderers
function renderer(
  tokens: Token[],
  index: number,
  type: CustomSyntaxRule,
): string {
  const token = tokens[index];
  if (token.nesting === 1) {
    return `<span style="${type}:${token.attrGet(type)}">`;
  } else if (token.nesting === -1) {
    return "</span>";
  } else {
    return "";
  }
}

function colorRenderer(tokens: Token[], index: number): string {
  return renderer(tokens, index, "color");
}

function textDecorationRenderer(tokens: Token[], index: number): string {
  return renderer(tokens, index, "text-decoration");
}

function backgroundColorRenderer(tokens: Token[], index: number): string {
  return renderer(tokens, index, "background-color");
}

function strong_open(): string {
  return "<span style=\"font-weight:bold\">";
}

function strong_close(): string {
  return "</span>";
}

function em_open(): string {
  return "<span style=\"font-style:italic\">";
}

function paragraph_open(): string {
  return "";
}

const paragraph_close = paragraph_open;

const heading_open = paragraph_open;

const heading_close = paragraph_close;

const em_close = strong_close;
// #endregion

/**
 * Scans delimiters based, and indicates whether the token can be an open and/or closing tag.
 * Based on https://github.com/markdown-it/markdown-it/blob/1ad3aec2041cd2defa7e299543cc1e42184b680d/lib/rules_inline/state_inline.js#L69
 * @param md The `MarkdownIt` instance.
 * @param src The markdown source/content.
 * @param start The index of the starting location to scan.
 */
function scanDelims(
  md: MarkdownIt,
  src: string,
  start: number,
): { canOpen: boolean; canClose: boolean; length: number } {
  let pos = start;
  const max = src.length;

  let leftFlanking = true;
  let rightFlanking = true;
  // treat beginning of the line as a whitespace
  const lastChar = start > 0 ? src.charCodeAt(start - 1) : STRING_CHAR_CODE;

  while (pos < max && src[pos] !== "}") {
    pos++;
  }
  pos++;

  const count = pos - start;

  // treat end of the line as a whitespace
  const nextChar = pos < max ? src.charCodeAt(pos) : STRING_CHAR_CODE;

  const isLastPunctChar =
    md.utils.isMdAsciiPunct(lastChar) ||
    md.utils.isPunctChar(String.fromCharCode(lastChar));
  const isNextPunctChar =
    md.utils.isMdAsciiPunct(nextChar) ||
    md.utils.isPunctChar(String.fromCharCode(nextChar));

  const isLastWhiteSpace = md.utils.isWhiteSpace(lastChar);
  const isNextWhiteSpace = md.utils.isWhiteSpace(nextChar);

  if (isNextWhiteSpace) {
    leftFlanking = false;
  } else if (isNextPunctChar) {
    if (!(isLastWhiteSpace || isLastPunctChar)) {
      leftFlanking = false;
    }
  }

  if (isLastWhiteSpace) {
    rightFlanking = false;
  } else if (isLastPunctChar) {
    if (!(isNextWhiteSpace || isNextPunctChar)) {
      rightFlanking = false;
    }
  }

  return {
    canClose: rightFlanking,
    canOpen: leftFlanking,
    length: count,
  };
}

/**
 * Contains a stack of the string of the delimiting tokens - i.e. the strings of the markdown tokens.
 */
const delimStack: string[] = [];

/**
 * Plugin for `markdown-it` with the custom syntax.
 * @param state The state of the compiler.
 * @param token The current token.
 * @param pos The position of the position to start the scan inside the content.
 */
function customSyntax(state: StateCore, token: Token, pos: number): Token[] {
  let tokens: Token[] = [token];
  let continueChecking = true;
  while (continueChecking) {
    continueChecking = false;
    const currentToken = tokens[tokens.length - 1];
    const tagMatch = tagRule.exec(currentToken.content);
    if (tagMatch) {
      // assumes that the tag is at the start of the content
      currentToken.content = currentToken.content.slice(
        tagMatch.index + tagMatch[0].length,
      );
    }
    for (const [type, rule] of rules) {
      const matches = rule.exec(currentToken.content);
      if (matches) {
        continueChecking = true;
        const match = matches[0];
        const startIndex = matches.index;
        const endIndex = matches.index + match.length;

        const tokenBefore: Token = {
          ...new Token(
            currentToken.type,
            currentToken.tag,
            currentToken.nesting,
          ),
          attrs: currentToken.attrs,
          block: currentToken.block,
          children: currentToken.children,
          content: currentToken.content.slice(0, startIndex),
          hidden: currentToken.hidden,
          info: currentToken.info,
          level: currentToken.level,
          map: currentToken.map,
          markup: currentToken.markup,
          meta: currentToken.meta,
          nesting: currentToken.nesting,
          tag: currentToken.tag,
          type: currentToken.type,
        };

        const tokenAfter: Token = {
          ...new Token(
            currentToken.type,
            currentToken.tag,
            currentToken.nesting,
          ),
          attrs: currentToken.attrs,
          block: currentToken.block,
          children: currentToken.children,
          content: currentToken.content.slice(endIndex),
          hidden: currentToken.hidden,
          info: currentToken.info,
          level: currentToken.level,
          map: currentToken.map,
          markup: currentToken.markup,
          meta: currentToken.meta,
          nesting: currentToken.nesting,
          tag: currentToken.tag,
          type: currentToken.type,
        };

        const result = scanDelims(state.md, state.src, pos);
        const matchedToken: Token = new Token(
          getAttributeName(type, true),
          "span",
          result.canClose ? -1 : 1,
        );

        if (
          result.canClose &&
          delimStack[delimStack.length - 1] &&
          delimStack[delimStack.length - 1] === match
        ) {
          delimStack.pop();
          matchedToken.nesting = -1;
        } else {
          result.canClose = false;
          if (result.canOpen) {
            delimStack.push(match);
            matchedToken.nesting = 1;
          } else {
            matchedToken.nesting = 0;
          }
        }
        matchedToken.attrPush([type, match.split(":")[1].slice(0, -1)]);

        tokens.pop();
        tokens = tokens.concat(
          [tokenBefore, matchedToken, tokenAfter].reduce(
            (acc, curr) => {
              if (curr.content || (curr.attrs && curr.attrGet(type))) {
                acc.push(curr);
              }
              return acc;
            },
            [] as Token[],
          ),
        );
        pos += tokenAfter.content.length;
      }
    }
  }
  return tokens;
}

/**
 * The `markdown-it` rule for the custom syntax.
 * @param state The state of the compiler.
 */
function rule(state: StateCore): void {
  state.tokens.forEach((token) => {
    if (token.type === "inline") {
      let inlineTokens: Token[] = [];
      let pos = 0;
      token.children.forEach((currentToken) => {
        inlineTokens = inlineTokens.concat(
          customSyntax(state, currentToken, pos),
        );
        pos += currentToken.content.length || currentToken.markup.length;
      });
      token.children = inlineTokens;
    }
  });
}

export function customSyntaxPlugin(md: MarkdownIt): void {
  md.renderer.rules.color = colorRenderer;
  md.renderer.rules.textDecoration = textDecorationRenderer;
  md.renderer.rules.backgroundColor = backgroundColorRenderer;
  md.renderer.rules.strong_open = strong_open;
  md.renderer.rules.strong_close = strong_close;
  md.renderer.rules.em_open = em_open;
  md.renderer.rules.em_close = em_close;
  md.renderer.rules.paragraph_open = paragraph_open;
  md.renderer.rules.paragraph_close = paragraph_close;
  md.renderer.rules.heading_open = heading_open;
  md.renderer.rules.heading_close = heading_close;
  md.core.ruler.push("customSyntaxRule", rule);
}
