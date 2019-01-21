import { OnenotePage } from "@microsoft/microsoft-graph-types";
import { Color, PageContent } from "../pageModel";
import { Buffer, ContentNode } from "./contentModel";
import {
  getLineStarts,
  getNewlineFormat,
  SENTINEL,
  SENTINEL_INDEX,
} from "./tree";

/**
 * Creates a new page, and its associated piece table.
 * @param receivedPage The received page from the Microsoft Graph.
 */
export function createNewPage(receivedPage: OnenotePage): PageContent {
  const newlineFormat = getNewlineFormat(receivedPage.content);
  const buffer: Buffer = {
    isReadOnly: true,
    lineStarts: getLineStarts(receivedPage.content, newlineFormat),
    content: receivedPage.content,
  };
  const finalLine = buffer.lineStarts.length - 1;
  const finalLineInitialCharIndex = buffer.lineStarts[finalLine];
  const finalCharColumn =
    receivedPage.content.length - finalLineInitialCharIndex;
  const node: ContentNode = {
    bufferIndex: 0,
    start: { line: 0, column: 0 },
    end: { line: finalLine, column: finalCharColumn },
    leftCharCount: 0,
    leftLineFeedCount: 0,
    length: receivedPage.content.length,
    lineFeedCount: buffer.lineStarts.length,
    color: Color.Black,
    parent: SENTINEL_INDEX,
    left: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
  };
  return {
    buffers: [buffer],
    newlineFormat,
    nodes: [SENTINEL, node],
    root: 0,
    previouslyInsertedContentNodeIndex: null,
    previouslyInsertedContentNodeOffset: null,
  };
}
