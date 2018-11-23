import { IPageContent } from "../model";
import { SENTINEL_INDEX } from "../reducer";

export function leftRotate(
  pieceTable: IPageContent,
  nodeIndex: number,
): IPageContent {
  const nodes = [...pieceTable.nodes];

  const xIndex = nodeIndex;
  const x = { ...nodes[xIndex] };

  if (x.right === -1) {
    //  you can't left rotate
    return pieceTable;
  }
  const yIndex = x.right;
  const y = { ...nodes[yIndex] };

  let root = pieceTable.root;

  // fix leftCharCount
  y.leftCharCount += x.leftCharCount + x.length;
  y.leftLineFeedCount += x.leftLineFeedCount + x.lineFeedCount;

  x.right = y.left;
  if (y.left !== SENTINEL_INDEX) {
    nodes[y.left] = {
      ...nodes[y.left],
      parent: xIndex,
    };
  }
  y.parent = x.parent;
  if (x.parent === SENTINEL_INDEX) {
    root = yIndex;
  } else if (xIndex === nodes[x.parent].left) {
    nodes[x.parent] = {
      ...nodes[x.parent],
      left: yIndex,
    };
  } else {
    nodes[x.parent] = {
      ...nodes[x.parent],
      right: yIndex,
    };
  }
  y.left = xIndex;
  x.parent = yIndex;

  nodes[xIndex] = x;
  nodes[yIndex] = y;

  return {
    ...pieceTable,
    nodes,
    root,
  };
}

export function rightRotate(
  pieceTable: IPageContent,
  nodeIndex: number,
): IPageContent {
  const nodes = [...pieceTable.nodes];

  const yIndex = nodeIndex;
  const y = { ...nodes[yIndex] };

  if (y.left === -1) {
    // you can't right rotate
    return pieceTable;
  }
  const xIndex = y.left;
  const x = { ...nodes[xIndex] };

  let root = pieceTable.root;

  y.left = x.right;
  if (x.right !== SENTINEL_INDEX) {
    nodes[x.right] = {
      ...nodes[x.right],
      parent: yIndex,
    };
  }
  x.parent = y.parent;

  // fix leftCharCount
  y.leftCharCount -= x.leftCharCount + x.length;
  y.leftLineFeedCount -= x.leftLineFeedCount + x.lineFeedCount;

  if (y.parent === SENTINEL_INDEX) {
    root = xIndex;
  } else if (yIndex === nodes[y.parent].right) {
    nodes[y.parent] = {
      ...nodes[y.parent],
      right: xIndex,
    };
  } else {
    nodes[y.parent] = {
      ...nodes[y.parent],
      left: xIndex,
    };
  }
  x.right = yIndex;
  y.parent = xIndex;

  nodes[yIndex] = y;
  nodes[xIndex] = x;

  return {
    ...pieceTable,
    nodes,
    root,
  };
}
