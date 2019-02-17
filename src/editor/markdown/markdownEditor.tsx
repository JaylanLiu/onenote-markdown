import React, { useEffect } from "react";
import EditorBase, {
  Stack,
  LastStartNode,
  getLastStartItem,
  BeforeInputType,
} from "../editorBase";
import styles from "./markdownEditor.module.css";
import { connect } from "react-redux";
import { PageContent } from "../../page/pageModel";
import { State } from "../../reducer";
import {
  StructureNode,
  TagType,
} from "../../page/structureTree/structureModel";
import { inorderTreeTraversal } from "../../page/tree/tree";
import { getContentBetweenOffsets } from "../../page/contentTree/tree";
import {
  insertContent,
  InsertContentAction,
} from "../../page/contentTree/actions";
import { Dispatch } from "redux";
import {
  SplitStructureAction,
  splitStructureNode,
} from "../../page/structureTree/actions";

/**
 * Definition for items which reside on the stack of elements to be rendered.
 */
interface StackItem {
  node: StructureNode;

  /**
   * The offset of the start of the content for the `StructureNode`.
   */
  contentOffset: number;

  /**
   * The index of the `node` inside the array `structure.nodes`.
   */
  index: number;
}

let cursorSelection: {
  nodeIndex: number;
  selectionOffset: number;
} | null = null;
const selectionRef = React.createRef();

/**
 * Updates the stack by compiling the last `StackItem` which has a
 * `tagType === TagType.StartTag` is compiled, with all the elements on the
 * stack after the last start tag being children.
 * @param stack The stack of `StackItem`s.
 * @param lastStartNode The last `StackItem`, which has
 * `tagType === TagType.StartTag`.
 */
function updateItem(
  page: PageContent,
  stack: Stack<StackItem>,
  { contentOffset, index, node, stackIndex }: LastStartNode<StackItem>,
): Stack<StackItem> {
  const newStack = stack.slice(0, stackIndex);
  let children: Stack<StackItem> | string;
  if (stackIndex === stack.length - 1) {
    const startOffset = contentOffset;
    const endOffset = contentOffset + node.length;
    children = getContentBetweenOffsets(page, startOffset, endOffset);
  } else {
    children = stack.slice(stackIndex);
  }
  const ref =
    cursorSelection && cursorSelection.nodeIndex === index
      ? selectionRef
      : null;
  const element = React.createElement(
    "p",
    {
      ...node.attributes,
      contentoffset: contentOffset,
      nodeindex: index,
      key: node.id,
      ref,
    },
    children,
  );
  newStack.push(element);
  return newStack;
}

/**
 * Returns the updated stack. The last `StackItem` which has a
 * `tagType === TagType.StartTag` is compiled, with all the elements on the
 * stack after the last start tag being children.
 */
function updateStack(
  page: PageContent,
  stack: Stack<StackItem>,
): Stack<StackItem> {
  const lastStartStackItem = getLastStartItem(stack);
  if (lastStartStackItem) {
    return updateItem(page, stack, lastStartStackItem);
  } else {
    throw new Error(
      "There's a mismatch between the number of start and end tags",
    );
  }
}

/**
 * Adds a React element for a `StartEnd` tag.
 */
function addStartEndTag<T>(
  stack: Stack<T>,
  node: StructureNode,
  contentOffset: number,
): void {
  switch (node.tag) {
    case "br": {
      const props = {
        contentoffset: contentOffset,
        isbreak: "true",
        key: node.id,
      };
      stack.push(<p {...props}>&nbsp;</p>);
      break;
    }
    default:
      break;
  }
}

/**
 * Returns a `JSX.Element[]` of the OneNote page.
 * @param page The page to render.
 */
function getPage(page: PageContent): JSX.Element[] {
  let stack: Stack<StackItem> = [];
  let contentOffset = 0;
  for (const { index, node } of inorderTreeTraversal(page.structure)) {
    switch (node.tagType) {
      case TagType.StartTag: {
        stack.push({ contentOffset, index, node });
        contentOffset += node.length;
        break;
      }
      case TagType.EndTag: {
        stack = updateStack(page, stack);
        break;
      }
      case TagType.StartEndTag: {
        addStartEndTag(stack, node, contentOffset);
        break;
      }
    }
  }
  return stack as JSX.Element[];
}

interface SelectionOffset {
  /**
   * The offset of the start of the node, in terms of the page's content.
   */
  startOffset: number;

  /**
   * The offset of the selection, in terms of the page's content.
   */
  selectionOffset: number;

  /**
   * The offset of the end of the node, in terms of the page's content.
   */
  endOffset: number;
}

/**
 * Returns the start, selection point, and end offsets inside the entire page,
 * given the node and selection offset.
 */
function getOffsets(node: Node, selectionOffset: number): SelectionOffset {
  if (node.parentElement) {
    const startOffsetStr = node.parentElement.attributes.getNamedItem(
      "contentoffset",
    );
    if (!startOffsetStr) {
      throw new Error("Unable to retrieve the contentoffset for the node.");
    }
    const startOffset = Number(startOffsetStr.value);
    if (node.textContent) {
      return {
        endOffset: startOffset + node.textContent.length,
        selectionOffset: startOffset + selectionOffset,
        startOffset,
      };
    } else {
      throw new Error("The DOM node does not contain text.");
    }
  } else {
    throw new Error("DOM node doesn't have a parent node.");
  }
}

/**
 * Compares two `SelectionOffset` objects to see if they're identical.
 */
function offsetsAreEqual(
  firstOffset: SelectionOffset,
  secondOffset: SelectionOffset,
): boolean {
  return (
    firstOffset.startOffset === secondOffset.startOffset &&
    firstOffset.selectionOffset === secondOffset.selectionOffset &&
    firstOffset.endOffset === secondOffset.endOffset
  );
}

export function MarkdownEditorComponent(
  props: MarkdownEditorStateProps & MarkdownEditorDispatchProps,
): JSX.Element {
  function insertContent(
    structureNodeIndex: Attr,
    anchorOffset: number,
    data: string,
    startOffsets: SelectionOffset,
  ): void {
    const structureNodeIndexValue = Number(structureNodeIndex.value);
    if (data === "\n") {
      props.splitStructureNode(
        props.pageId,
        structureNodeIndexValue,
        startOffsets.selectionOffset,
        anchorOffset,
      );
    } else {
      cursorSelection = {
        nodeIndex: structureNodeIndexValue,
        selectionOffset: anchorOffset,
      };
      props.insertContent(
        props.pageId,
        data,
        startOffsets.selectionOffset,
        structureNodeIndexValue,
      );
    }
  }

  function onBeforeInput(e: BeforeInputType): void {
    e.preventDefault();
    const {
      anchorNode,
      anchorOffset,
      focusNode,
      focusOffset,
    } = window.getSelection();
    const startOffsets = getOffsets(anchorNode, anchorOffset);
    const endOffsets = getOffsets(focusNode, focusOffset);

    if (offsetsAreEqual(startOffsets, endOffsets)) {
      const structureNodeIndex = anchorNode.parentElement!.attributes.getNamedItem(
        "nodeindex",
      );
      if (structureNodeIndex) {
        insertContent(structureNodeIndex, anchorOffset, e.data, startOffsets);
      }
    }
  }

  useEffect(() => {
    if (cursorSelection) {
      const selection = window.getSelection();
      selection.empty();
      const range = document.createRange();
      const node = (selectionRef.current as HTMLSpanElement).firstChild;
      range.setStart(node!, cursorSelection.selectionOffset + 1);
      selection.addRange(range);
    }
  });

  return (
    <div className={styles.editor}>
      <EditorBase
        getPage={getPage}
        page={props.page}
        onBeforeInput={onBeforeInput}
      />
    </div>
  );
}

/**
 * Props for the `MarkdownEditorComponent`
 */
interface MarkdownEditorStateProps {
  pageId: string;
  page: PageContent;
}

interface MarkdownEditorDispatchProps {
  insertContent: (
    pageId: string,
    content: string,
    offset: number,
    structureNodeIndex: number,
  ) => InsertContentAction;
  splitStructureNode: (
    pageId: string,
    nodeIndex: number,
    nodeContentOffset: number,
    localContentOffset: number,
  ) => SplitStructureAction;
}

const mapStateToProps = (state: State): MarkdownEditorStateProps => ({
  page: state.pages[state.selectedPage],
  pageId: state.selectedPage,
});

const mapDispatchToProps = (
  dispatch: Dispatch,
): MarkdownEditorDispatchProps => ({
  insertContent: (
    pageId,
    content,
    offset,
    structureNodeIndex,
  ): InsertContentAction =>
    dispatch(insertContent(pageId, content, offset, structureNodeIndex)),
  splitStructureNode: (
    pageId: string,
    nodeIndex: number,
    nodeContentOffset: number,
    localContentOffset: number,
  ): SplitStructureAction =>
    dispatch(
      splitStructureNode(
        pageId,
        nodeIndex,
        nodeContentOffset,
        localContentOffset,
      ),
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MarkdownEditorComponent);
