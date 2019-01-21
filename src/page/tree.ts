import { SENTINEL, SENTINEL_INDEX } from "./internalTree/tree";
import { Node } from "./pageModel";

/**
 * Contains a node and its index in a page/piece table.
 */
export interface NodePosition {
  readonly node: Node;
  readonly index: number;
}

/**
 * Finds the minimum of the subtree given by the `x`
 * @param nodes The red-black tree.
 * @param x The index from which to find the minimum of that subtree.
 */
export function treeMinimum(
  nodes: ReadonlyArray<Node>,
  x: number,
): NodePosition {
  while (nodes[x].left !== SENTINEL_INDEX) {
    x = nodes[x].left;
  }
  return { node: nodes[x], index: x };
}

/**
 * Finds the maximum of the subtree given by the `x`
 * @param nodes The red-black tree.
 * @param x The index from which to find the maximum of that subtree.
 */
export function treeMaximum(
  nodes: ReadonlyArray<Node>,
  x: number,
): NodePosition {
  while (nodes[x].right !== SENTINEL_INDEX) {
    x = nodes[x].right;
  }
  return { node: nodes[x], index: x };
}

/**
 * Gets the next node of a red-black tree, given the current node's index.
 * @param nodes The red-black tree.
 * @param currentNode The index of the current node in the `nodes` array.
 */
export function nextNode(
  nodes: ReadonlyArray<Node>,
  currentNode: number,
): NodePosition {
  if (nodes[currentNode].right !== SENTINEL_INDEX) {
    return treeMinimum(nodes, nodes[currentNode].right);
  }

  while (nodes[currentNode].parent !== SENTINEL_INDEX) {
    if (nodes[nodes[currentNode].parent].left === currentNode) {
      break;
    }

    currentNode = nodes[currentNode].parent;
  }

  if (nodes[currentNode].parent === SENTINEL_INDEX) {
    return { node: SENTINEL, index: SENTINEL_INDEX };
  } else {
    return {
      index: nodes[currentNode].parent,
      node: nodes[nodes[currentNode].parent],
    };
  }
}

/**
 * Gets the previous node of a red-black tree, given the current node's index.
 * @param nodes The red-black tree.
 * @param currentNode The index of the current node in the `nodes` array.
 */
export function prevNode(
  nodes: ReadonlyArray<Node>,
  currentNode: number,
): NodePosition {
  if (nodes[currentNode].left !== SENTINEL_INDEX) {
    return treeMaximum(nodes, nodes[currentNode].left);
  }

  while (nodes[currentNode].parent !== SENTINEL_INDEX) {
    if (nodes[nodes[currentNode].parent].right === currentNode) {
      break;
    }

    currentNode = nodes[currentNode].parent;
  }

  if (nodes[currentNode].parent === SENTINEL_INDEX) {
    return { node: SENTINEL, index: SENTINEL_INDEX };
  } else {
    return {
      index: nodes[currentNode].parent,
      node: nodes[nodes[currentNode].parent],
    };
  }
}
