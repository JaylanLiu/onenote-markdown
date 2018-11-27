import { Color, IBuffer, INode, IPageContent } from "../model";
import { SENTINEL_INDEX, SENTINEL } from "../reducer";
import { leftRotate, rightRotate } from "./rotate";
import { findNodeAtOffset, getLineStarts, INodePosition } from "./tree";

export interface IContentInsert {
  content: string;
  offset: number;
}

export function insertContent(
  content: IContentInsert,
  page: IPageContent,
  maxBufferLength: number,
): IPageContent {
  let previouslyInsertedNode: INode | undefined;
  let newPage: IPageContent | undefined;
  let xIndex: number | undefined;

  if (
    page.previouslyInsertedNodeIndex != null &&
    page.previouslyInsertedNodeOffset != null
  ) {
    previouslyInsertedNode = page.nodes[page.previouslyInsertedNodeIndex];
  }

  if (
    previouslyInsertedNode !== undefined &&
    content.offset ===
      page.previouslyInsertedNodeOffset! + previouslyInsertedNode.length
  ) {
    const result = insertAtEndPreviouslyInsertedNode(
      content,
      page,
      maxBufferLength,
    );
    newPage = result.newPage;
    xIndex = result.xIndex;
  } else {
    const nodePosition = findNodeAtOffset(
      content.offset - 1,
      page.nodes,
      page.root,
    );

    if (
      content.offset ===
      nodePosition.nodeStartOffset + nodePosition.node.length + 1
    ) {
      const result = insertAtEndOfANode(
        content,
        page,
        maxBufferLength,
        nodePosition,
      );
      newPage = result.newPage;
      xIndex = result.xIndex;
    }
  }

  if (newPage && xIndex !== undefined) {
    return fixInsert(newPage, xIndex);
  }
  return page;
}

/**
 * Restores the properties of a red-black tree after the insertion of a node.
 * @param page The page/piece table.
 * @param xIndex The index of the node in the `node` array, which is the basis for fixing the tree.
 */
export function fixInsert(page: IPageContent, xIndex: number): IPageContent {
  page = { ...page };
  page = recomputeTreeMetadata(page, xIndex);
  page.nodes = [...page.nodes];
  let x = { ...page.nodes[xIndex] };
  page.nodes[xIndex] = x;

  if (xIndex === page.root) {
    x.color = Color.Black;
    return page;
  }

  while (
    page.nodes[page.nodes[x.parent].parent] &&
    xIndex !== page.root &&
    page.nodes[x.parent].color === Color.Red
  ) {
    if (x.parent === page.nodes[page.nodes[x.parent].parent].left) {
      const yIndex = page.nodes[page.nodes[x.parent].parent].right;
      const y = { ...page.nodes[yIndex] };
      page.nodes[yIndex] = y;

      if (y.color === Color.Red) {
        page.nodes[x.parent] = {
          ...page.nodes[x.parent],
          color: Color.Black,
        };
        y.color = Color.Black;
        page.nodes[page.nodes[x.parent].parent] = {
          ...page.nodes[page.nodes[x.parent].parent],
          color: Color.Red,
        };
        xIndex = page.nodes[x.parent].parent;
        x = { ...page.nodes[xIndex] };
        page.nodes[xIndex] = x;
      } else {
        if (xIndex === page.nodes[x.parent].right) {
          xIndex = x.parent;
          x = { ...page.nodes[xIndex] };
          page.nodes[xIndex] = x;
          page = leftRotate(page, xIndex);
          page.nodes = page.nodes;
          x = page.nodes[xIndex];
        }
        page.nodes[x.parent] = {
          ...page.nodes[x.parent],
          color: Color.Black,
        };
        page.nodes[page.nodes[x.parent].parent] = {
          ...page.nodes[page.nodes[x.parent].parent],
          color: Color.Red,
        };
        page = rightRotate(page, page.nodes[x.parent].parent);
      }
    } else {
      const y = { ...page.nodes[page.nodes[page.nodes[x.parent].parent].left] };
      page.nodes[page.nodes[page.nodes[x.parent].parent].left] = y;

      if (y.color === Color.Red) {
        page.nodes[x.parent] = {
          ...page.nodes[x.parent],
          color: Color.Black,
        };
        y.color = Color.Black;
        page.nodes[page.nodes[x.parent].parent] = {
          ...page.nodes[page.nodes[x.parent].parent],
          color: Color.Red,
        };
        xIndex = page.nodes[x.parent].parent;
        x = { ...page.nodes[xIndex] };
        page.nodes[xIndex] = x;
      } else {
        if (x === page.nodes[page.nodes[x.parent].left]) {
          xIndex = x.parent;
          x = { ...page.nodes[xIndex] };
          page.nodes[xIndex] = x;
          page = rightRotate(page, xIndex);
          x = page.nodes[xIndex];
        }
        page.nodes[x.parent] = {
          ...page.nodes[x.parent],
          color: Color.Black,
        };
        page.nodes[page.nodes[x.parent].parent] = {
          ...page.nodes[page.nodes[x.parent].parent],
          color: Color.Red,
        };
        page = leftRotate(page, page.nodes[x.parent].parent);
      }
    }
  }
  page.nodes[page.root] = {
    ...page.nodes[page.root],
    color: Color.Black,
  };

  return page;
}

/**
 * Recomputes the metadata for the tree based on the newly inserted node.
 * @param page The page/piece table.
 * @param index The index of the node in the `node` array, which is the basis for updating the tree.
 */
export function recomputeTreeMetadata(
  page: IPageContent,
  xIndex: number,
): IPageContent {
  let lengthDelta = 0;
  let lineFeedDelta = 0;
  if (xIndex === page.root) {
    return page;
  }

  page.nodes = [...page.nodes];
  let x = { ...page.nodes[xIndex] };
  page.nodes[xIndex] = x;

  // go upwards till the node whose left subtree is changed.
  while (xIndex !== page.root && xIndex === page.nodes[x.parent].right) {
    xIndex = x.parent;
    x = page.nodes[xIndex];
  }

  if (xIndex === page.root) {
    // well, it means we add a node to the end (inorder)
    return page;
  }

  // x is the node whose right subtree is changed.
  xIndex = x.parent;
  x = { ...page.nodes[xIndex] };
  page.nodes[xIndex] = x;

  lengthDelta = calculateCharCount(page, x.left) - x.leftCharCount;
  lineFeedDelta = calculateLineFeedCount(page, x.left) - x.leftLineFeedCount;
  x.leftCharCount += lengthDelta;
  x.leftLineFeedCount += lineFeedDelta;

  // go upwards till root. O(logN)
  while (xIndex !== page.root && (lengthDelta !== 0 || lineFeedDelta !== 0)) {
    if (page.nodes[x.parent].left === xIndex) {
      page.nodes[x.parent] = {
        ...page.nodes[x.parent],
      };
      page.nodes[x.parent].leftCharCount += lengthDelta;
      page.nodes[x.parent].leftLineFeedCount += lineFeedDelta;
    }

    xIndex = x.parent;
    x = { ...page.nodes[xIndex] };
    page.nodes[xIndex] = x;
  }

  return page;
}

/**
 * Calculates the character count for the node and its subtree.
 * @param page The page/piece table
 * @param index The index of the node in the `node` array of the page/piece table to find the character count for.
 */
export function calculateCharCount(page: IPageContent, index: number): number {
  if (index === SENTINEL_INDEX) {
    return 0;
  }
  const node = page.nodes[index];
  return (
    node.leftCharCount + node.length + calculateCharCount(page, node.right)
  );
}

/**
 * Calculates the line feed count for the node and its subtree.
 * @param page The page/piece table
 * @param index The index of the node in the `node` array of the page/piece table to find the line feed count for.
 */
export function calculateLineFeedCount(
  page: IPageContent,
  index: number,
): number {
  if (index === SENTINEL_INDEX) {
    return 0;
  }
  const node = page.nodes[index];
  return (
    node.leftLineFeedCount +
    node.lineFeedCount +
    calculateLineFeedCount(page, node.right)
  );
}

interface IResultInsert {
  newPage: IPageContent;
  xIndex: number;
}

function insertAtEndPreviouslyInsertedNode(
  content: IContentInsert,
  page: IPageContent,
  maxBufferLength: number,
): IResultInsert {
  // check buffer size
  if (
    content.content.length +
      page.buffers[page.buffers.length - 1].content.length <=
    maxBufferLength
  ) {
    // scenario 1: can fit inside the previous buffer
    // appends to the previous node
    // appends to the previous buffer
    const buffer: IBuffer = {
      ...page.buffers[page.buffers.length - 1],
    };
    const newContent = buffer.content + content.content;
    buffer.content = newContent;
    buffer.lineStarts = getLineStarts(newContent, page.newlineFormat);

    const node: INode = {
      ...page.nodes[page.nodes.length - 1],
      end: {
        line: buffer.lineStarts.length - 1,
        column:
          buffer.content.length -
          buffer.lineStarts[buffer.lineStarts.length - 1],
      },
      lineFeedCount: buffer.lineStarts.length - 1,
    };
    node.length += content.content.length;

    const newPage: IPageContent = {
      ...page,
    };
    newPage.buffers[newPage.buffers.length - 1] = buffer;
    newPage.nodes[newPage.nodes.length - 1] = node;
    return { newPage, xIndex: newPage.nodes.length - 1 };
  } else {
    // scenario 2: cannot fit inside the previous buffer
    // creates a new node
    // creates a new buffer
    const buffer: IBuffer = {
      isReadOnly: false,
      lineStarts: getLineStarts(content.content, page.newlineFormat),
      content: content.content,
    };

    const node: INode = {
      bufferIndex: page.nodes.length,
      start: { line: 0, column: 0 },
      end: {
        line: buffer.lineStarts.length - 1,
        column:
          buffer.content.length -
          buffer.lineStarts[buffer.lineStarts.length - 1],
      },
      leftCharCount: 0,
      leftLineFeedCount: 0,
      length: content.content.length,
      lineFeedCount: buffer.lineStarts.length - 1,
      color: Color.Red,
      parent: page.nodes.length - 1,
      left: SENTINEL_INDEX,
      right: SENTINEL_INDEX,
    };

    const newPage: IPageContent = {
      ...page,
    };

    newPage.buffers.push(buffer);
    newPage.nodes.push(node);
    newPage.nodes[newPage.nodes.length - 2] = {
      ...newPage.nodes[newPage.nodes.length - 2],
      right: newPage.nodes.length - 1,
    };
    return { newPage, xIndex: newPage.nodes.length - 1 };
  }
}
