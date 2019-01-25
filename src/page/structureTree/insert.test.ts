import { NEWLINE } from "../contentTree/contentModel";
import { Color, PageContentMutable, StatePages } from "../pageModel";
import { SENTINEL_INDEX } from "../tree/tree";
import { SENTINEL_STRUCTURE } from "./tree";
import { SENTINEL_CONTENT } from "../contentTree/tree";
import pageReducer from "../reducer";
import { insertStructure } from "./actions";
import { TagType } from "./structureModel";

describe("structureTree insert tests", () => {
  test("Less than insertion - left side", () => {
    const page: PageContentMutable = {
      buffers: [],
      content: { nodes: [SENTINEL_CONTENT], root: SENTINEL_INDEX },
      newlineFormat: NEWLINE.LF,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: {
        nodes: [
          SENTINEL_STRUCTURE,
          {
            // 1
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 2,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 2
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 1,
            leftSubTreeLength: 1,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 3
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 2,
            leftSubTreeLength: 2,
            parent: 5,
            right: 4,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 4
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 5
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 3,
            leftSubTreeLength: 4,
            parent: SENTINEL_INDEX,
            right: 7,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 6
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 7,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 7
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 6,
            leftSubTreeLength: 1,
            parent: 5,
            right: 10,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 8
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 10,
            right: 9,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 9
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 8,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 10
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: 8,
            leftSubTreeLength: 2,
            parent: 7,
            right: 12,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 11
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 12
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 11,
            leftSubTreeLength: 1,
            parent: 10,
            right: 13,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 13
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
        ],
        root: 5,
      },
    };
    const state: StatePages = {
      pageId: page,
    };

    const expectedPage: PageContentMutable = {
      buffers: [],
      content: { nodes: [SENTINEL_CONTENT], root: SENTINEL_INDEX },
      newlineFormat: NEWLINE.LF,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: {
        nodes: [
          SENTINEL_STRUCTURE,
          {
            // 1
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 2,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 2
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 1,
            leftSubTreeLength: 1,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 3
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 2,
            leftSubTreeLength: 2,
            parent: 5,
            right: 4,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 4
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 5
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 3,
            leftSubTreeLength: 4,
            parent: SENTINEL_INDEX,
            right: 7,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 6
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 7,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 7
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 6,
            leftSubTreeLength: 1,
            parent: 5,
            right: 10,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 8
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 14,
            leftSubTreeLength: 1,
            parent: 10,
            right: 9,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 9
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 8,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 10
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: 8,
            leftSubTreeLength: 3,
            parent: 7,
            right: 12,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 11
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 12
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 11,
            leftSubTreeLength: 1,
            parent: 10,
            right: 13,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 13
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 14
            attributes: undefined,
            color: Color.Red,
            id: "newNode",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 8,
            right: SENTINEL_INDEX,
            styles: undefined,
            tag: "img",
            tagType: TagType.StartEndTag,
          },
        ],
        root: 5,
      },
    };
    const expectedState: StatePages = {
      pageId: expectedPage,
    };

    const resultState = pageReducer(
      state,
      insertStructure("pageId", 8, "img", TagType.StartEndTag, "newNode"),
    );
    expect(resultState).toStrictEqual(expectedState);
  });

  test("Less than insertion - right side", () => {
    const page: PageContentMutable = {
      buffers: [],
      content: { nodes: [SENTINEL_CONTENT], root: SENTINEL_INDEX },
      newlineFormat: NEWLINE.LF,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: {
        nodes: [
          SENTINEL_STRUCTURE,
          {
            // 1
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 2,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 2
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 1,
            leftSubTreeLength: 1,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 3
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 2,
            leftSubTreeLength: 2,
            parent: 5,
            right: 4,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 4
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 5
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 3,
            leftSubTreeLength: 4,
            parent: SENTINEL_INDEX,
            right: 7,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 6
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 7,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 7
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 6,
            leftSubTreeLength: 1,
            parent: 5,
            right: 10,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 8
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 9,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 9
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 8,
            leftSubTreeLength: 1,
            parent: 10,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 10
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: 9,
            leftSubTreeLength: 2,
            parent: 7,
            right: 12,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 11
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 12
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 11,
            leftSubTreeLength: 1,
            parent: 10,
            right: 13,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 13
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
        ],
        root: 5,
      },
    };
    const state: StatePages = {
      pageId: page,
    };

    const expectedPage: PageContentMutable = {
      buffers: [],
      content: { nodes: [SENTINEL_CONTENT], root: SENTINEL_INDEX },
      newlineFormat: NEWLINE.LF,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: {
        nodes: [
          SENTINEL_STRUCTURE,
          {
            // 1
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 2,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 2
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 1,
            leftSubTreeLength: 1,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 3
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 2,
            leftSubTreeLength: 2,
            parent: 5,
            right: 4,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 4
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 5
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 3,
            leftSubTreeLength: 4,
            parent: SENTINEL_INDEX,
            right: 7,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 6
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 7,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 7
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 6,
            leftSubTreeLength: 1,
            parent: 5,
            right: 10,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 8
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 9,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 9
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 8,
            leftSubTreeLength: 1,
            parent: 10,
            right: 14,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 10
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: 9,
            leftSubTreeLength: 3,
            parent: 7,
            right: 12,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 11
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 12
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 11,
            leftSubTreeLength: 1,
            parent: 10,
            right: 13,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 13
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 14
            attributes: undefined,
            color: Color.Red,
            id: "newNode",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 9,
            right: SENTINEL_INDEX,
            styles: undefined,
            tag: "img",
            tagType: TagType.StartEndTag,
          },
        ],
        root: 5,
      },
    };
    const expectedState: StatePages = {
      pageId: expectedPage,
    };

    const resultState = pageReducer(
      state,
      insertStructure(
        "pageId",
        10,
        "img",
        TagType.StartEndTag,
        "newNode",
        undefined,
        undefined,
      ),
    );
    expect(resultState).toStrictEqual(expectedState);
  });

  test("Greater than insertion", () => {
    const page: PageContentMutable = {
      buffers: [],
      content: { nodes: [SENTINEL_CONTENT], root: SENTINEL_INDEX },
      newlineFormat: NEWLINE.LF,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: {
        nodes: [
          SENTINEL_STRUCTURE,
          {
            // 1
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 2,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 2
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 1,
            leftSubTreeLength: 1,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 3
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 2,
            leftSubTreeLength: 2,
            parent: 5,
            right: 4,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 4
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 5
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 3,
            leftSubTreeLength: 4,
            parent: SENTINEL_INDEX,
            right: 7,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 6
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 7,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 7
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 6,
            leftSubTreeLength: 1,
            parent: 5,
            right: 10,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 8
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 9,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 9
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 8,
            leftSubTreeLength: 1,
            parent: 10,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 10
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: 9,
            leftSubTreeLength: 2,
            parent: 7,
            right: 12,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 11
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 12
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 11,
            leftSubTreeLength: 1,
            parent: 10,
            right: 13,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 13
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
        ],
        root: 5,
      },
    };
    const state: StatePages = {
      pageId: page,
    };

    const expectedPage: PageContentMutable = {
      buffers: [],
      content: { nodes: [SENTINEL_CONTENT], root: SENTINEL_INDEX },
      newlineFormat: NEWLINE.LF,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: {
        nodes: [
          SENTINEL_STRUCTURE,
          {
            // 1
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 2,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 2
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 1,
            leftSubTreeLength: 1,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 3
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 2,
            leftSubTreeLength: 2,
            parent: 5,
            right: 4,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 4
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 5
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 3,
            leftSubTreeLength: 4,
            parent: SENTINEL_INDEX,
            right: 10,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 6
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 7,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 7
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: 6,
            leftSubTreeLength: 1,
            parent: 10,
            right: 9,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 8
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 9,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 9
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 8,
            leftSubTreeLength: 1,
            parent: 7,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 10
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: 7,
            leftSubTreeLength: 4,
            parent: 5,
            right: 12,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 11
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 12
            attributes: undefined,
            color: Color.Red,
            id: "helloWorld",
            left: 11,
            leftSubTreeLength: 1,
            parent: 10,
            right: 13,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 13
            attributes: undefined,
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: 14,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 14
            attributes: undefined,
            color: Color.Red,
            id: "newNode",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 13,
            right: SENTINEL_INDEX,
            styles: undefined,
            tag: "img",
            tagType: TagType.StartEndTag,
          },
        ],
        root: 5,
      },
    };
    const expectedState: StatePages = {
      pageId: expectedPage,
    };

    const resultState = pageReducer(
      state,
      insertStructure("pageId", 14, "img", TagType.StartEndTag, "newNode"),
    );
    expect(resultState).toStrictEqual(expectedState);
  });
});
