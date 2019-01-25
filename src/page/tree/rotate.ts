import { SENTINEL_INDEX } from "../tree/tree";
import {
  ContentNodeMutable,
  ContentNode,
  isContentNode,
} from "../contentTree/contentModel";
import { RedBlackTree, NodeMutable } from "../pageModel";
import {
  isStructureNode,
  StructureNodeMutable,
} from "../structureTree/structureModel";

/**
 * Performs a left rotation on the red-black tree, on the given node.
 * @param page The page/piece table.
 * @param nodeIndex The index of the node in the array for which the left rotation is performed on.
 */
export function leftRotate(tree: RedBlackTree, nodeIndex: number): void {
  const x = nodeIndex;

  if (tree.nodes[x].right === SENTINEL_INDEX) {
    //  you can't left rotate
    return;
  }

  tree.nodes[x] = { ...tree.nodes[x] };

  const y = tree.nodes[x].right;
  tree.nodes[y] = { ...tree.nodes[y] };

  if (isContentNode(tree.nodes[y])) {
    (tree.nodes[y] as ContentNodeMutable).leftCharCount +=
      (tree.nodes[x] as ContentNode).leftCharCount +
      (tree.nodes[x] as ContentNode).length;
    (tree.nodes[y] as ContentNodeMutable).leftLineFeedCount +=
      (tree.nodes[x] as ContentNode).leftLineFeedCount +
      (tree.nodes[x] as ContentNode).lineFeedCount;
  } else if (isStructureNode(tree.nodes[y])) {
    (tree.nodes[y] as StructureNodeMutable).leftSubTreeLength +=
      (tree.nodes[x] as StructureNodeMutable).leftSubTreeLength + 1;
  }

  (tree.nodes[x] as NodeMutable).right = tree.nodes[y].left;
  if (tree.nodes[y].left !== SENTINEL_INDEX) {
    tree.nodes[tree.nodes[y].left] = {
      ...tree.nodes[tree.nodes[y].left],
      parent: x,
    };
  }

  (tree.nodes[y] as NodeMutable).parent = tree.nodes[x].parent;
  if (tree.nodes[x].parent === SENTINEL_INDEX) {
    tree.root = y;
  } else if (x === tree.nodes[tree.nodes[x].parent].left) {
    tree.nodes[tree.nodes[x].parent] = {
      ...tree.nodes[tree.nodes[x].parent],
      left: y,
    };
  } else {
    tree.nodes[tree.nodes[x].parent] = {
      ...tree.nodes[tree.nodes[x].parent],
      right: y,
    };
  }

  (tree.nodes[y] as NodeMutable).left = x;
  (tree.nodes[x] as NodeMutable).parent = y;
}

/**
 * Performs a right rotation on the red-black tree, on the given node.
 * @param page The page/piece table.
 * @param nodeIndex The index of the node in the array for which the right rotation is performed on.
 */
export function rightRotate(tree: RedBlackTree, nodeIndex: number): void {
  const y = nodeIndex;

  if (tree.nodes[y].left === SENTINEL_INDEX) {
    // you can't right rotate
    return;
  }

  const x = tree.nodes[y].left;
  tree.nodes[x] = { ...tree.nodes[x] };

  tree.nodes[y] = { ...tree.nodes[y] };

  if (isContentNode(tree.nodes[y])) {
    (tree.nodes[y] as ContentNodeMutable).leftCharCount -=
      (tree.nodes[x] as ContentNodeMutable).leftCharCount +
      (tree.nodes[x] as ContentNodeMutable).length;
    (tree.nodes[y] as ContentNodeMutable).leftLineFeedCount -=
      (tree.nodes[x] as ContentNodeMutable).leftLineFeedCount +
      (tree.nodes[x] as ContentNodeMutable).lineFeedCount;
  } else if (isStructureNode(tree.nodes[y])) {
    (tree.nodes[y] as StructureNodeMutable).leftSubTreeLength -=
      (tree.nodes[x] as StructureNodeMutable).leftSubTreeLength + 1;
  }

  (tree.nodes[y] as NodeMutable).left = tree.nodes[x].right;

  if (tree.nodes[x].right !== SENTINEL_INDEX) {
    tree.nodes[tree.nodes[x].right] = {
      ...tree.nodes[tree.nodes[x].right],
      parent: y,
    };
  }

  (tree.nodes[x] as NodeMutable).parent = tree.nodes[y].parent;

  if (tree.nodes[y].parent === SENTINEL_INDEX) {
    tree.root = x;
  } else if (y === tree.nodes[tree.nodes[y].parent].right) {
    tree.nodes[tree.nodes[y].parent] = {
      ...tree.nodes[tree.nodes[y].parent],
      right: x,
    };
  } else {
    tree.nodes[tree.nodes[y].parent] = {
      ...tree.nodes[tree.nodes[y].parent],
      left: x,
    };
  }
  (tree.nodes[x] as NodeMutable).right = y;
  (tree.nodes[y] as NodeMutable).parent = x;
}
