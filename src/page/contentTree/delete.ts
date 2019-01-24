import { Color, PageContent, PageContentMutable } from "../pageModel";
import { nextNode, SENTINEL_INDEX, treeMinimum } from "../tree/tree";
import { ContentNode, ContentNodeMutable } from "./contentModel";
import { insertNode } from "./insert";
import { fixInsert } from "../tree/insert";
import { leftRotate, rightRotate } from "../tree/rotate";
import {
  calculateCharCount,
  calculateLineFeedCount,
  findNodeAtOffset,
  NodePositionOffset,
  recomputeContentTreeMetadata,
  resetSentinel,
  updateTreeMetadata,
} from "./tree";

/**
 * The logical offset range for the content to be deleted.
 */
export interface ContentDelete {
  readonly startOffset: number;
  readonly endOffset: number;
}

/**
 * Gets the number of line feeds before, between, and after a start and end offset.
 * Returns `-1` if nodePosition.remainder === nodePosition.nodeStartOffset.
 * @param page The page/piece table.
 * @param nodePosition The position of the node which contains the offset.
 * @param startLocalOffset The logical offset inside the entire piece table.
 * @param endLocalOffset The logical offset inside the entire piece table.
 */
function getLineFeedCountsForOffsets(
  page: PageContent,
  nodePosition: NodePositionOffset,
  startLocalOffset: number,
  endLocalOffset: number,
): {
    lineFeedCountBeforeNodeStart: number;
    lineFeedCountAfterNodeStartBeforeStart: number;
    lineFeedCountBetweenOffset: number;
    lineFeedCountAfterEnd: number;
  } {
  const buffer = page.buffers[nodePosition.node.bufferIndex];
  const nodeStartOffset =
    page.buffers[nodePosition.node.bufferIndex].lineStarts[
      nodePosition.node.start.line
    ] + nodePosition.node.start.column;
  let lineFeedCountBeforeNodeStart = 0;
  let lineFeedCountAfterNodeStartBeforeStart = 0;
  let lineFeedCountBetweenOffset = 0;
  let lineFeedCountAfterEnd = 0;

  for (let i = 1; i < buffer.lineStarts.length; i++) {
    const el = buffer.lineStarts[i];
    if (el < nodeStartOffset) {
      lineFeedCountBeforeNodeStart++;
    } else if (nodeStartOffset <= el && el < startLocalOffset) {
      lineFeedCountAfterNodeStartBeforeStart++;
    } else if (startLocalOffset <= el && el < endLocalOffset) {
      lineFeedCountBetweenOffset++;
    } else if (endLocalOffset <= el) {
      lineFeedCountAfterEnd++;
    }
  }
  return {
    lineFeedCountAfterEnd,
    lineFeedCountAfterNodeStartBeforeStart,
    lineFeedCountBeforeNodeStart,
    lineFeedCountBetweenOffset,
  };
}

/**
 * Restores the properties of a red-black tree after the deletion of a node.
 * @param page The page/piece table.
 * @param x The node to start the fixup from.
 */
function fixDelete(page: PageContentMutable, x: number): void {
  let w: number;

  while (
    x !== page.content.root &&
    page.content.nodes[x].color === Color.Black
  ) {
    if (x === page.content.nodes[page.content.nodes[x].parent].left) {
      w = page.content.nodes[page.content.nodes[x].parent].right;
      (page.content.nodes[w] as ContentNodeMutable) = {
        ...page.content.nodes[w],
      };

      if ((page.content.nodes[w] as ContentNodeMutable).color === Color.Red) {
        (page.content.nodes[w] as ContentNodeMutable).color = Color.Black;
        (page.content.nodes[
          page.content.nodes[x].parent
        ] as ContentNodeMutable) = {
          ...page.content.nodes[page.content.nodes[x].parent],
          color: Color.Red,
        };
        leftRotate(page.content, page.content.nodes[x].parent);
        w = page.content.nodes[page.content.nodes[x].parent].right;
        (page.content.nodes[w] as ContentNodeMutable) = {
          ...page.content.nodes[w],
        };
      }

      if (
        page.content.nodes[page.content.nodes[w].left].color === Color.Black &&
        page.content.nodes[page.content.nodes[w].right].color === Color.Black
      ) {
        (page.content.nodes[w] as ContentNodeMutable).color = Color.Red;
        x = page.content.nodes[x].parent;
        (page.content.nodes[x] as ContentNodeMutable) = {
          ...page.content.nodes[x],
        };
      } else {
        if (
          page.content.nodes[page.content.nodes[w].right].color === Color.Black
        ) {
          (page.content.nodes[
            page.content.nodes[w].left
          ] as ContentNodeMutable) = {
            ...page.content.nodes[page.content.nodes[w].left],
            color: Color.Black,
          };
          (page.content.nodes[w] as ContentNodeMutable).color = Color.Red;
          rightRotate(page.content, w);
          w = page.content.nodes[page.content.nodes[x].parent].right;
          (page.content.nodes[w] as ContentNodeMutable) = {
            ...page.content.nodes[w],
          };
        }

        (page.content.nodes[w] as ContentNodeMutable).color =
          page.content.nodes[page.content.nodes[x].parent].color;
        (page.content.nodes[
          page.content.nodes[x].parent
        ] as ContentNodeMutable) = {
          ...page.content.nodes[page.content.nodes[x].parent],
          color: Color.Black,
        };
        (page.content.nodes[
          page.content.nodes[w].right
        ] as ContentNodeMutable) = {
          ...page.content.nodes[page.content.nodes[w].right],
          color: Color.Black,
        };
        leftRotate(page.content, page.content.nodes[x].parent);
        x = page.content.root;
        (page.content.nodes[x] as ContentNodeMutable) = {
          ...page.content.nodes[x],
        };
      }
    } else {
      w = page.content.nodes[page.content.nodes[x].parent].left;
      (page.content.nodes[w] as ContentNodeMutable) = {
        ...page.content.nodes[w],
      };

      if (page.content.nodes[w].color === Color.Red) {
        (page.content.nodes[w] as ContentNodeMutable).color = Color.Black;
        (page.content.nodes[
          page.content.nodes[x].parent
        ] as ContentNodeMutable) = {
          ...page.content.nodes[page.content.nodes[x].parent],
          color: Color.Red,
        };
        rightRotate(page.content, page.content.nodes[x].parent);
        w = page.content.nodes[page.content.nodes[x].parent].left;
        (page.content.nodes[w] as ContentNodeMutable) = {
          ...page.content.nodes[w],
        };
      }

      if (
        page.content.nodes[page.content.nodes[w].left].color === Color.Black &&
        page.content.nodes[page.content.nodes[w].right].color === Color.Black
      ) {
        (page.content.nodes[w] as ContentNodeMutable).color = Color.Red;
        x = page.content.nodes[x].parent;
        (page.content.nodes[x] as ContentNodeMutable) = {
          ...page.content.nodes[x],
        };
      } else {
        if (
          page.content.nodes[page.content.nodes[w].left].color === Color.Black
        ) {
          (page.content.nodes[
            page.content.nodes[w].right
          ] as ContentNodeMutable) = {
            ...page.content.nodes[page.content.nodes[w].right],
            color: Color.Black,
          };
          (page.content.nodes[w] as ContentNodeMutable).color = Color.Red;
          leftRotate(page.content, w);
          w = page.content.nodes[page.content.nodes[x].parent].left;
        }

        (page.content.nodes[w] as ContentNodeMutable).color =
          page.content.nodes[page.content.nodes[x].parent].color;
        (page.content.nodes[
          page.content.nodes[x].parent
        ] as ContentNodeMutable) = {
          ...page.content.nodes[page.content.nodes[x].parent],
          color: Color.Black,
        };
        (page.content.nodes[
          page.content.nodes[w].left
        ] as ContentNodeMutable) = {
          ...page.content.nodes[page.content.nodes[w].left],
          color: Color.Black,
        };
        rightRotate(page.content, page.content.nodes[x].parent);
        x = page.content.root;
        (page.content.nodes[x] as ContentNodeMutable) = {
          ...page.content.nodes[x],
        };
      }
    }
  }
  (page.content.nodes[x] as ContentNodeMutable) = {
    ...page.content.nodes[x],
    color: Color.Black,
  };
}

/**
 * Sets the color of the node to `Color.BLack`, and sets `parent`, `left`, and `right` to `SENTINEL_INDEX`.
 * @param page The page/piece table.
 * @param node The index of the node to detach.
 */
function detach(page: PageContentMutable, node: number): void {
  const parent = page.content.nodes[page.content.nodes[node].parent]; // NEVER ASSIGN TO THIS
  if (parent.left === node) {
    page.content.nodes[page.content.nodes[node].parent] = {
      ...page.content.nodes[page.content.nodes[node].parent],
      left: SENTINEL_INDEX,
    };
  } else if (parent.right === node) {
    page.content.nodes[page.content.nodes[node].parent] = {
      ...page.content.nodes[page.content.nodes[node].parent],
      right: SENTINEL_INDEX,
    };
  }
  page.content.nodes[node] = {
    ...page.content.nodes[node],
    color: Color.Black,
    parent: SENTINEL_INDEX,
    left: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
  };
}

/**
 * Deletes a node from the page/piece table. The node itself still resides inside the piece table, however `parent`,
 * `left`, and `right` will point to `SENTINEL_INDEX`, and no other nodes will point to the deleted node.
 * @param page The page/piece table.
 * @param z The index of the node to delete.
 */
export function deleteNode(page: PageContentMutable, z: number): void {
  page.content.nodes[z] = { ...page.content.nodes[z] };
  let xTemp: number;
  let yTemp: number;

  if (page.content.nodes[z].left === SENTINEL_INDEX) {
    yTemp = z;
    page.content.nodes[yTemp] = page.content.nodes[z];
    xTemp = page.content.nodes[yTemp].right;
  } else if (page.content.nodes[z].right === SENTINEL_INDEX) {
    yTemp = z;
    page.content.nodes[yTemp] = page.content.nodes[z];
    xTemp = page.content.nodes[yTemp].left;
  } else {
    const result = treeMinimum(page.content.nodes, page.content.nodes[z].right);
    yTemp = result.index;
    page.content.nodes[yTemp] = { ...(result.node as ContentNode) };
    xTemp = page.content.nodes[yTemp].right;
  }

  // This ensures that x and y don't change after this point
  const x = xTemp;
  const y = yTemp;

  page.content.nodes[x] = { ...page.content.nodes[x] };

  if (y === page.content.root) {
    page.content.root = x;

    // if page.nodes[x] is null, we are removing the only node
    (page.content.nodes[x] as ContentNodeMutable).color = Color.Black;
    detach(page, z);
    page.content.nodes[page.content.root] = {
      ...page.content.nodes[page.content.root],
      parent: SENTINEL_INDEX,
    };
    resetSentinel(page);
    return;
  }

  const yWasRed = page.content.nodes[y].color === Color.Red;

  if (y === page.content.nodes[page.content.nodes[y].parent].left) {
    page.content.nodes[page.content.nodes[y].parent] = {
      ...page.content.nodes[page.content.nodes[y].parent],
      left: x,
    };
  } else {
    page.content.nodes[page.content.nodes[y].parent] = {
      ...page.content.nodes[page.content.nodes[y].parent],
      right: x,
    };
  }

  if (y === z) {
    (page.content.nodes[x] as ContentNodeMutable).parent =
      page.content.nodes[y].parent;
    recomputeContentTreeMetadata(page.content, x);
  } else {
    if (page.content.nodes[y].parent === z) {
      (page.content.nodes[x] as ContentNodeMutable).parent = y;
    } else {
      (page.content.nodes[x] as ContentNodeMutable).parent =
        page.content.nodes[y].parent;
    }

    // as we make changes to page.nodes[x]'s hierarchy, update leftCharCount of subtree first
    recomputeContentTreeMetadata(page.content, x);

    (page.content.nodes[y] as ContentNodeMutable).left =
      page.content.nodes[z].left;
    (page.content.nodes[y] as ContentNodeMutable).right =
      page.content.nodes[z].right;
    (page.content.nodes[y] as ContentNodeMutable).parent =
      page.content.nodes[z].parent;
    (page.content.nodes[y] as ContentNodeMutable).color =
      page.content.nodes[z].color;

    if (z === page.content.root) {
      page.content.root = y;
    } else {
      if (z === page.content.nodes[page.content.nodes[z].parent].left) {
        page.content.nodes[page.content.nodes[z].parent] = {
          ...page.content.nodes[page.content.nodes[z].parent],
          left: y,
        };
      } else {
        page.content.nodes[page.content.nodes[z].parent] = {
          ...page.content.nodes[page.content.nodes[z].parent],
          right: y,
        };
      }
    }

    if (page.content.nodes[y].left !== SENTINEL_INDEX) {
      page.content.nodes[page.content.nodes[y].left] = {
        ...page.content.nodes[page.content.nodes[y].left],
        parent: y,
      };
    }
    if (page.content.nodes[y].right !== SENTINEL_INDEX) {
      page.content.nodes[page.content.nodes[y].right] = {
        ...page.content.nodes[page.content.nodes[y].right],
        parent: y,
      };
    }
    // update metadata
    // we replace page.nodes[z] with page.nodes[y], so in this sub tree, the length change is page.nodes[z].item.length
    (page.content.nodes[y] as ContentNodeMutable).leftCharCount =
      page.content.nodes[z].leftCharCount;
    (page.content.nodes[y] as ContentNodeMutable).leftLineFeedCount =
      page.content.nodes[z].leftLineFeedCount;
    recomputeContentTreeMetadata(page.content, y);
  }

  detach(page, z);

  if (page.content.nodes[page.content.nodes[x].parent].left === x) {
    const newSizeLeft = calculateCharCount(page.content, x);
    const newLFLeft = calculateLineFeedCount(page.content, x);
    if (
      newSizeLeft !==
        page.content.nodes[page.content.nodes[x].parent].leftCharCount ||
      newLFLeft !==
        page.content.nodes[page.content.nodes[x].parent].leftLineFeedCount
    ) {
      const charDelta =
        newSizeLeft -
        page.content.nodes[page.content.nodes[x].parent].leftCharCount;
      const lineFeedDelta =
        newLFLeft -
        page.content.nodes[page.content.nodes[x].parent].leftLineFeedCount;
      page.content.nodes[page.content.nodes[x].parent] = {
        ...page.content.nodes[page.content.nodes[x].parent],
        leftCharCount: newSizeLeft,
        leftLineFeedCount: newSizeLeft,
      };
      updateTreeMetadata(
        page,
        page.content.nodes[x].parent,
        charDelta,
        lineFeedDelta,
      );
    }
  }

  recomputeContentTreeMetadata(page.content, page.content.nodes[x].parent);

  if (yWasRed) {
    resetSentinel(page);
    return;
  }

  fixDelete(page, x);
  resetSentinel(page);
  return;
}

/**
 * Deletes nodes inorder between the start and end index.
 * Format: `startIndex <= in order node to delete < endIndex`
 * @param page The page/piece table.
 * @param startIndex The index of the first node to delete.
 * @param endIndex The index of the node after the last node to delete.
 */
function deleteBetweenNodes(
  page: PageContentMutable,
  startIndex: number,
  endIndex: number,
): void {
  let currentIndex = startIndex;
  let nextIndex = currentIndex;
  while (nextIndex !== endIndex) {
    currentIndex = nextIndex;
    nextIndex = nextNode(page.content.nodes, currentIndex).index;
    deleteNode(page, currentIndex);
  }
}

/**
 * Gets the node after the content.
 * @param page The page/piece table.
 * @param deleteRange The start and end offset of the content to delete.
 * @param nodePosition The position of the old node after the content to delete.
 */
function getNodeAfterContent(
  page: PageContent,
  deleteRange: ContentDelete,
  nodePosition: NodePositionOffset,
): ContentNode {
  // localStartOffset is the index of nodePosition.startOffset inside the buffer
  const localStartOffset =
    page.buffers[nodePosition.node.bufferIndex].lineStarts[
      nodePosition.node.start.line
    ] + nodePosition.node.start.column;
  const deletedLength = deleteRange.endOffset - deleteRange.startOffset;

  const firstSection = nodePosition.nodeStartOffset - deleteRange.startOffset;
  const secondSection = deletedLength - firstSection;
  // localEndOffset is the offset of the content after the deleted content
  const localEndOffset = localStartOffset + secondSection + 1;

  const length =
    nodePosition.nodeStartOffset +
    nodePosition.node.length -
    deleteRange.endOffset;
  const {
    lineFeedCountAfterNodeStartBeforeStart,
    lineFeedCountBetweenOffset,
  } = getLineFeedCountsForOffsets(
    page,
    nodePosition,
    localEndOffset,
    localEndOffset + length,
  );
  const nodeAfterContentStartLine =
    nodePosition.node.start.line + lineFeedCountAfterNodeStartBeforeStart;
  const lineStartOffset =
    page.buffers[nodePosition.node.bufferIndex].lineStarts[
      nodeAfterContentStartLine
    ];
  const nodeAfterContent: ContentNode = {
    bufferIndex: nodePosition.node.bufferIndex,
    color: Color.Red,
    end: nodePosition.node.end,
    left: 0,
    leftCharCount: 0,
    leftLineFeedCount: 0,
    length,
    lineFeedCount: lineFeedCountBetweenOffset,
    parent: 0,
    right: 0,
    start: {
      column: localEndOffset - lineStartOffset - 1,
      line: nodeAfterContentStartLine,
    },
  };
  return nodeAfterContent;
}

/**
 * Gets the node after the content.
 * @param page The page/piece table.
 * @param deleteRange The start and end offset of the content to delete.
 * @param nodePosition The position of the old node before the content to delete.
 */
function getNodeBeforeContent(
  page: PageContent,
  deleteRange: ContentDelete,
  nodePosition: NodePositionOffset,
): ContentNode {
  // "local" offsets refer to local within the buffer
  const localStartOffset =
    page.buffers[nodePosition.node.bufferIndex].lineStarts[
      nodePosition.node.start.line
    ] +
    nodePosition.node.start.column +
    nodePosition.remainder;
  const deletedLength = deleteRange.endOffset - deleteRange.startOffset;
  const localEndOffset = localStartOffset + deletedLength + 1;
  const {
    lineFeedCountBeforeNodeStart,
    lineFeedCountAfterNodeStartBeforeStart,
  } = getLineFeedCountsForOffsets(
    page,
    nodePosition,
    localStartOffset,
    localEndOffset,
  );
  const nodeBeforeContent: ContentNode = {
    ...nodePosition.node,
    end: {
      column:
        localStartOffset -
        page.buffers[nodePosition.node.bufferIndex].lineStarts[
          lineFeedCountBeforeNodeStart + lineFeedCountAfterNodeStartBeforeStart
        ],
      line:
        lineFeedCountBeforeNodeStart + lineFeedCountAfterNodeStartBeforeStart,
    },
    length: nodePosition.remainder,
    lineFeedCount: lineFeedCountAfterNodeStartBeforeStart,
  };
  return nodeBeforeContent;
}

/**
 * Updates the new node with tree metadata provided by the old node. The node is then placed inside the tree, and
 * tree metadata is recomputed.
 * @param page The page/piece table.
 * @param index The index of the old node.
 * @param newNode The new node to replace the old node.
 */
function updateNode(
  page: PageContentMutable,
  index: number,
  newNode: ContentNodeMutable,
): void {
  newNode.leftCharCount = page.content.nodes[index].leftCharCount;
  newNode.leftLineFeedCount = page.content.nodes[index].leftLineFeedCount;
  newNode.parent = page.content.nodes[index].parent;
  newNode.left = page.content.nodes[index].left;
  newNode.right = page.content.nodes[index].right;
  newNode.color = page.content.nodes[index].color;
  page.content.nodes[index] = newNode;
  recomputeContentTreeMetadata(page.content, index);
}

/**
 * Deletes the given range from the page.
 * @param page The page/piece table to delete the content from.
 * @param deleteRange The start and end offset of the content to delete.
 */
export function deleteContent(
  page: PageContentMutable,
  deleteRange: ContentDelete,
): void {
  const oldNodeStartPosition = findNodeAtOffset(
    deleteRange.startOffset,
    page.content.nodes,
    page.content.root,
  );
  let oldNodeEndPosition: NodePositionOffset;
  const nodeBeforeContent = getNodeBeforeContent(
    page,
    deleteRange,
    oldNodeStartPosition,
  );
  const deleteLength = deleteRange.endOffset - deleteRange.startOffset;
  let nodeAfterContent: ContentNode;
  if (
    oldNodeStartPosition.remainder + deleteLength <=
    oldNodeStartPosition.node.length
  ) {
    nodeAfterContent = getNodeAfterContent(
      page,
      deleteRange,
      oldNodeStartPosition,
    );
    oldNodeEndPosition = oldNodeStartPosition;
  } else {
    oldNodeEndPosition = findNodeAtOffset(
      deleteRange.endOffset,
      page.content.nodes,
      page.content.root,
    );
    nodeAfterContent = getNodeAfterContent(
      page,
      deleteRange,
      oldNodeEndPosition,
    );
  }

  let firstNodeToDelete = oldNodeStartPosition.nodeIndex;
  let nodeAfterLastNodeToDelete = oldNodeEndPosition.nodeIndex;
  if (
    oldNodeStartPosition === oldNodeEndPosition &&
    nodeBeforeContent.length > 0 &&
    nodeAfterContent.length > 0
  ) {
    // delete from a point in the node to another point in the node
    (page.content.nodes[
      oldNodeStartPosition.nodeIndex
    ] as ContentNodeMutable) = nodeBeforeContent;
    insertNode(page, nodeAfterContent, deleteRange.startOffset);
    fixInsert(page.content, page.content.nodes.length - 1);
  } else if (nodeBeforeContent.length > 0 && nodeAfterContent.length > 0) {
    // delete from a point in a node to the end of another node
    updateNode(page, oldNodeStartPosition.nodeIndex, nodeBeforeContent);
    updateNode(page, oldNodeEndPosition.nodeIndex, nodeAfterContent);
    firstNodeToDelete = nextNode(page.content.nodes, firstNodeToDelete).index;
  } else if (nodeBeforeContent.length > 0) {
    // delete from a point in the node to the end of the node
    (page.content.nodes[
      oldNodeStartPosition.nodeIndex
    ] as ContentNodeMutable) = nodeBeforeContent;
    if (oldNodeStartPosition !== oldNodeEndPosition) {
      // deleting from a point in a node to the end of the content
      deleteNode(page, oldNodeEndPosition.nodeIndex);
      nodeAfterLastNodeToDelete = SENTINEL_INDEX;
      firstNodeToDelete = nextNode(page.content.nodes, firstNodeToDelete).index;
    }
  } else if (nodeAfterContent.length > 0) {
    // delete from the start of the node to a point in the node
    updateNode(page, oldNodeEndPosition.nodeIndex, nodeAfterContent);
  } else if (oldNodeStartPosition === oldNodeEndPosition) {
    // delete the entire node
    deleteNode(page, oldNodeStartPosition.nodeIndex);
  } else {
    // deleting up to and including the last node
    nodeAfterLastNodeToDelete = nextNode(
      page.content.nodes,
      nodeAfterLastNodeToDelete,
    ).index;
  }

  page.previouslyInsertedContentNodeIndex = null;
  page.previouslyInsertedContentNodeOffset = null;

  if (oldNodeStartPosition.nodeIndex !== oldNodeEndPosition.nodeIndex) {
    deleteBetweenNodes(page, firstNodeToDelete, nodeAfterLastNodeToDelete);
  }
  resetSentinel(page);
}
