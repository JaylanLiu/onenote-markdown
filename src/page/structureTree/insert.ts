import { PageContentMutable, Color } from "../pageModel";
import { StructureNode, StructureNodeMutable } from "./structureModel";
import { SENTINEL_INDEX } from "../tree/tree";
import { insertNode, fixInsert } from "../tree/insert";
import { InsertStructureProps } from "./actions";

/**
 * Inserts a new `StructureNode` into `.structure.nodes`.
 * @param page The page in which the structure node is going to be inserted.
 * @param insertStructureAction The insertion action.
 */
export function insertStructureNode(
  page: PageContentMutable,
  insertStructureAction: InsertStructureProps,
): void {
  const {
    attributes,
    id,
    style,
    tag,
    tagType,
    offset,
    length,
  } = insertStructureAction;
  const newNode: StructureNode = {
    color: Color.Red,
    id,
    left: SENTINEL_INDEX,
    leftSubTreeLength: 0,
    length,
    parent: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
    tag,
    tagType,
  };
  if (style) {
    (newNode as StructureNodeMutable).style = style;
  }
  if (attributes) {
    (newNode as StructureNodeMutable).attributes = attributes;
  }
  insertNode(page.structure, newNode, offset);
  fixInsert(page.structure, page.structure.nodes.length - 1);
}
