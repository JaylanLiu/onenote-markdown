import { Color, IBuffer, INode, IPageContent } from "../model";
import { SENTINEL_INDEX } from "../reducer";
import { leftRotate, rightRotate } from "./rotate";
import {
  findNodeAtOffset,
  getLineStarts,
  getNodeContent,
  INodePosition,
} from "./tree";

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
    newPage = insertAtEndPreviouslyInsertedNode(content, page, maxBufferLength);
  } else {
    const nodePosition = findNodeAtOffset(
      content.offset,
      page.nodes,
      page.root,
    );
    newPage =
      nodePosition.nodeStartOffset < content.offset &&
      content.offset < nodePosition.nodeStartOffset + nodePosition.node.length
        ? (newPage = insertInsideNode(
            content,
            page,
            maxBufferLength,
            nodePosition,
          ))
        : (newPage = insertAtNodeExtremity(content, page, maxBufferLength));
  }

  if (newPage) {
    return fixInsert(newPage, newPage.nodes.length - 1);
  }
  return page;
}

/**
 * Restores the properties of a red-black tree after the insertion of a node.
 * @param page The page/piece table.
 * @param xIndex The index of the node in the `node` array, which is the basis for fixing the tree.
 */
export function fixInsert(page: IPageContent, xIndex: number): IPageContent {
  page = recomputeTreeMetadata({ ...page }, xIndex);
  let x = { ...page.nodes[xIndex] };
  page.nodes[xIndex] = x;

  if (xIndex === page.root) {
    x.color = Color.Black;
    return page;
  }

  while (
    x.parent !== SENTINEL_INDEX &&
    page.nodes[x.parent].parent !== SENTINEL_INDEX &&
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

function insertAtEndPreviouslyInsertedNode(
  content: IContentInsert,
  page: IPageContent,
  maxBufferLength: number,
): IPageContent {
  // check buffer size
  if (
    content.content.length +
      page.buffers[page.buffers.length - 1].content.length <=
    maxBufferLength
  ) {
    // scenario 1: can fit inside the previous buffer
    // appends to the previous node
    // appends to the previous buffer
    const oldBuffer = page.buffers[page.buffers.length - 1];
    const newContent = oldBuffer.content + content.content;
    const buffer: IBuffer = {
      isReadOnly: oldBuffer.isReadOnly,
      content: newContent,
      lineStarts: getLineStarts(newContent, page.newlineFormat),
    };

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
    return newPage;
  } else {
    // scenario 2: cannot fit inside the previous buffer
    // creates a new node
    // creates a new buffer
    return createNodeCreateBuffer(content, page);
  }
}

function insertInsideNode(
  content: IContentInsert,
  page: IPageContent,
  maxBufferLength: number,
  nodePosition: INodePosition,
): IPageContent {
  const oldNode = nodePosition.node;
  const nodeContent = getNodeContent(nodePosition.nodeIndex, page);
  const firstPartContent = nodeContent.slice(0, nodePosition.remainder);
  const firstPartLineStarts = getLineStarts(
    firstPartContent,
    page.newlineFormat,
  );

  const firstPartNode: INode = {
    ...oldNode,
    end: {
      line: firstPartLineStarts.length - 1,
      column:
        firstPartContent.length -
        firstPartLineStarts[firstPartLineStarts.length - 1],
    },
    length: firstPartContent.length,
    lineFeedCount: firstPartLineStarts.length - 1,
  };

  let newPage: IPageContent = { ...page, nodes: [...page.nodes] };
  newPage.nodes[nodePosition.nodeIndex] = firstPartNode;

  const secondPartNode: INode = {
    bufferIndex: oldNode.bufferIndex,
    start: firstPartNode.end,
    end: oldNode.end,
    leftCharCount: 0,
    leftLineFeedCount: 0,
    length: oldNode.length - firstPartNode.length,
    lineFeedCount: oldNode.lineFeedCount - firstPartNode.lineFeedCount,
    color: Color.Red,
    parent: SENTINEL_INDEX,
    left: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
  };

  newPage.nodes.push(secondPartNode);
  newPage = insertNode(newPage, secondPartNode, content.offset);
  newPage = fixInsert(newPage, newPage.nodes.length - 1);
  newPage = insertAtNodeExtremity(content, newPage, maxBufferLength);
  newPage.previouslyInsertedNodeIndex = page.nodes.length - 1;
  newPage.previouslyInsertedNodeOffset = content.offset;
  return newPage;
}

function insertAtNodeExtremity(
  content: IContentInsert,
  page: IPageContent,
  maxBufferLength: number,
): IPageContent {
  // check buffer size
  if (
    content.content.length +
      page.buffers[page.buffers.length - 1].content.length <=
      maxBufferLength &&
    page.buffers[page.buffers.length - 1].isReadOnly === false
  ) {
    // scenario 3 and 5: it can fit inside the previous buffer
    // creates a new node
    // appends to the previous buffer
    return createNodeAppendToBuffer(content, page);
  } else {
    // scenario 4 and 6: it cannot fit inside the previous buffer
    // creates a new node
    // creates a new buffer
    return createNodeCreateBuffer(content, page);
  }
}

function createNodeAppendToBuffer(content: IContentInsert, page: IPageContent) {
  const oldBuffer = page.buffers[page.buffers.length - 1];
  const newContent = oldBuffer.content + content.content;
  const updatedBuffer: IBuffer = {
    isReadOnly: oldBuffer.isReadOnly,
    content: newContent,
    lineStarts: getLineStarts(newContent, page.newlineFormat),
  };
  const newNode: INode = {
    bufferIndex: page.buffers.length - 1,
    start: {
      line: oldBuffer.lineStarts.length - 1,
      column:
        oldBuffer.content.length -
        oldBuffer.lineStarts[oldBuffer.lineStarts.length - 1],
    },
    end: {
      line: updatedBuffer.lineStarts.length - 1,
      column:
        updatedBuffer.content.length -
        updatedBuffer.lineStarts[updatedBuffer.lineStarts.length - 1],
    },
    leftCharCount: 0,
    leftLineFeedCount: 0,
    length: content.content.length,
    lineFeedCount:
      updatedBuffer.lineStarts.length - oldBuffer.lineStarts.length,
    color: Color.Red,
    parent: SENTINEL_INDEX,
    left: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
  };

  let newPage: IPageContent = {
    ...page,
    nodes: [...page.nodes],
    previouslyInsertedNodeIndex: page.nodes.length,
    previouslyInsertedNodeOffset: content.offset,
  };
  newPage.buffers[page.buffers.length - 1] = updatedBuffer;
  newPage.nodes.push(newNode);

  newPage = insertNode(newPage, newNode, content.offset);
  return newPage;
}

function createNodeCreateBuffer(content: IContentInsert, page: IPageContent) {
  const newBuffer: IBuffer = {
    isReadOnly: false,
    lineStarts: getLineStarts(content.content, page.newlineFormat),
    content: content.content,
  };
  const newNode: INode = {
    bufferIndex: page.buffers.length,
    start: { line: 0, column: 0 },
    end: {
      line: newBuffer.lineStarts.length - 1,
      column:
        newBuffer.content.length -
        newBuffer.lineStarts[newBuffer.lineStarts.length - 1],
    },
    leftCharCount: 0,
    leftLineFeedCount: 0,
    length: content.content.length,
    lineFeedCount: newBuffer.lineStarts.length - 1,
    color: Color.Red,
    parent: SENTINEL_INDEX,
    left: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
  };
  let newPage: IPageContent = {
    ...page,
    nodes: [...page.nodes],
    buffers: [...page.buffers],
    previouslyInsertedNodeIndex: page.nodes.length,
    previouslyInsertedNodeOffset: content.offset,
  };
  newPage.buffers.push(newBuffer);
  newPage.nodes.push(newNode);

  newPage = insertNode(newPage, newNode, content.offset);
  return newPage;
}

/**
 * Inserts a node at the given offset.
 * @param page The page/piece table.
 * @param newNode Reference to the newly created node. The node already exists inside `page.nodes`.
 * @param offset The offset of the new node.
 */
function insertNode(
  page: IPageContent,
  newNode: INode,
  offset: number,
): IPageContent {
  let prevIndex = SENTINEL_INDEX;

  let currentIndex = page.root;
  let currentNode = page.nodes[currentIndex];

  let nodeStartOffset = 0;
  const nodeIndex = page.nodes.length - 1; // the index of the new node

  while (currentIndex !== SENTINEL_INDEX) {
    prevIndex = currentIndex;
    if (offset <= nodeStartOffset + currentNode.leftCharCount) {
      // left
      prevIndex = currentIndex;
      currentIndex = currentNode.left;
      if (currentIndex === SENTINEL_INDEX) {
        page.nodes[prevIndex] = {
          ...page.nodes[prevIndex],
          left: nodeIndex,
        };
        newNode.parent = prevIndex; // can mutate the node since it's new
        return page;
      }
      currentNode = page.nodes[currentIndex];
    } else if (
      offset >=
      nodeStartOffset + currentNode.leftCharCount + currentNode.length
    ) {
      // right
      nodeStartOffset += currentNode.leftCharCount + currentNode.length;
      prevIndex = currentIndex;
      currentIndex = currentNode.right;
      if (currentIndex === SENTINEL_INDEX) {
        page.nodes[prevIndex] = {
          ...page.nodes[prevIndex],
          right: nodeIndex,
        };
        newNode.parent = prevIndex; // can mutate the node since it's new
        return page;
      }
      currentNode = page.nodes[currentIndex];
    } else {
      // middle
      throw RangeError(
        "Looking for the place to insert a node should never result in looking in the middle of another node.",
      );
    }
  }
  throw RangeError(
    "The currentIndex has reached a Sentinel node before locating a suitable insertion location.",
  );
  return null!; // never going to be hit
}
