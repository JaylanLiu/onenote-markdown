import { Color, NEWLINE, PageContent } from "../model";
import { deleteContent, deleteNode } from "./delete";
import { SENTINEL, SENTINEL_INDEX } from "./tree";

describe("page/tree/delete", () => {
  describe("delete node", () => {
    test("Scenario 1: Simple case", () => {
      const page: PageContent = {
        buffers: [],
        previouslyInsertedNodeIndex: null,
        previouslyInsertedNodeOffset: null,
        newlineFormat: NEWLINE.LF,
        root: 3,
        nodes: [
          SENTINEL,
          {
            // u
            bufferIndex: 1,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 10,
            lineFeedCount: 2,
            color: Color.Red,
            parent: 2,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
          {
            // v
            bufferIndex: 2,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 10,
            leftLineFeedCount: 2,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: 3,
            left: 1,
            right: SENTINEL_INDEX,
          },
          {
            bufferIndex: 3,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 20,
            leftLineFeedCount: 4,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: SENTINEL_INDEX,
            left: 2,
            right: 4,
          },
          {
            bufferIndex: 4,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: 3,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
      };
      const expectedPage: PageContent = {
        buffers: [],
        previouslyInsertedNodeIndex: null,
        previouslyInsertedNodeOffset: null,
        newlineFormat: NEWLINE.LF,
        root: 3,
        nodes: [
          SENTINEL,
          {
            // u
            bufferIndex: 1,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 10,
            lineFeedCount: 2,
            color: Color.Red,
            parent: SENTINEL_INDEX,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
          {
            // v
            bufferIndex: 2,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: 3,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
          {
            bufferIndex: 3,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 10,
            leftLineFeedCount: 2,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: SENTINEL_INDEX,
            left: 2,
            right: 4,
          },
          {
            bufferIndex: 4,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: 3,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
      };
      const receivedPage = deleteNode(page, 1);
      expect(receivedPage).toEqual(expectedPage);
    });

    describe("Sibling s is black and at least of one of s's children is red", () => {
      test("Scenario 2: Right right case", () => {
        const page: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 2,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 1,
              right: 4,
            },
            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 4,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: 3,
              right: 5,
            },
            {
              bufferIndex: 5,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 4,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const expectedPage: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 4,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 4,
              left: SENTINEL_INDEX,
              right: 3,
            },
            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 20,
              leftLineFeedCount: 4,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: 5,
            },
            {
              bufferIndex: 5,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 4,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const receivedPage = deleteNode(page, 1);
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 3: Right left case", () => {
        const page: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 2,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },

            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 1,
              right: 4,
            },

            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: 3,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const expectedPage: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 3,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 3,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: 4,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 3,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const receivedPage = deleteNode(page, 1);
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 4: Left left case", () => {
        const page: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 4,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 4,
              left: 1,
              right: 3,
            },
            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 30,
              leftLineFeedCount: 6,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: 5,
            },
            {
              bufferIndex: 5,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 4,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const expectedPage: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 2,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 1,
              right: 4,
            },
            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 4,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: 3,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 5,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const receivedPage = deleteNode(page, 5);
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 5: Left right case", () => {
        const page: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 3,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 3,
              left: SENTINEL_INDEX,
              right: 2,
            },
            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 20,
              leftLineFeedCount: 4,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 1,
              right: 4,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 3,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const expectedPage: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 2,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 1,
              right: 3,
            },
            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const receivedPage = deleteNode(page, 4);
        expect(receivedPage).toEqual(expectedPage);
      });
    });

    test("Scenario 6: Sibling s is black, and both its children are black", () => {
      const page: PageContent = {
        buffers: [],
        previouslyInsertedNodeIndex: null,
        previouslyInsertedNodeOffset: null,
        newlineFormat: NEWLINE.LF,
        root: 2,
        nodes: [
          SENTINEL,
          {
            bufferIndex: 1,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: 2,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
          {
            bufferIndex: 2,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 10,
            leftLineFeedCount: 2,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: SENTINEL_INDEX,
            left: 1,
            right: 3,
          },
          {
            bufferIndex: 3,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: 2,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
      };
      const expectedPage: PageContent = {
        buffers: [],
        previouslyInsertedNodeIndex: null,
        previouslyInsertedNodeOffset: null,
        newlineFormat: NEWLINE.LF,
        root: 2,
        nodes: [
          SENTINEL,
          {
            bufferIndex: 1,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: SENTINEL_INDEX,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
          {
            bufferIndex: 2,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: SENTINEL_INDEX,
            left: SENTINEL_INDEX,
            right: 3,
          },
          {
            bufferIndex: 3,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 10,
            lineFeedCount: 2,
            color: Color.Red,
            parent: 2,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
      };
      const receivedPage = deleteNode(page, 1);
      expect(receivedPage).toEqual(expectedPage);
    });

    describe("Sibling s is red", () => {
      test("Scenario 7: sibling s is right child of its parent", () => {
        const page: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 2,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 1,
              right: 4,
            },
            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 4,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 2,
              left: 3,
              right: 5,
            },
            {
              bufferIndex: 5,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 4,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const expectedPage: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 4,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 4,
              left: SENTINEL_INDEX,
              right: 3,
            },
            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 20,
              leftLineFeedCount: 4,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: 5,
            },
            {
              bufferIndex: 5,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 4,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const receivedPage = deleteNode(page, 1);
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 8: sibling s is left child of its parent", () => {
        const page: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 4,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 4,
              left: 1,
              right: 3,
            },
            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 30,
              leftLineFeedCount: 6,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: 5,
            },
            {
              bufferIndex: 5,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 4,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const expectedPage: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 2,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 1,
              right: 4,
            },
            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 4,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: 3,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 5,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const receivedPage = deleteNode(page, 5);
        expect(receivedPage).toEqual(expectedPage);
      });
    });

    test("Scenario 9: delete root", () => {
      const page: PageContent = {
        buffers: [],
        previouslyInsertedNodeIndex: null,
        previouslyInsertedNodeOffset: null,
        newlineFormat: NEWLINE.LF,
        root: 1,
        nodes: [
          SENTINEL,
          {
            bufferIndex: 1,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 30,
            leftLineFeedCount: 6,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: SENTINEL_INDEX,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
      };
      const expectedPage: PageContent = {
        buffers: [],
        previouslyInsertedNodeIndex: null,
        previouslyInsertedNodeOffset: null,
        newlineFormat: NEWLINE.LF,
        root: SENTINEL_INDEX,
        nodes: [
          SENTINEL,
          {
            bufferIndex: 1,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 30,
            leftLineFeedCount: 6,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: SENTINEL_INDEX,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
      };
      const receivedPage = deleteNode(page, 1);
      expect(receivedPage).toEqual(expectedPage);
    });
  });

  describe("delete content", () => {
    describe("Scenario 1a: delete the content from an entire node", () => {
      test("Scenario 1a: Test 1", () => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: 2,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: 1,
          previouslyInsertedNodeOffset: 5,
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const receivedPage = deleteContent(page, {
          startOffset: 5,
          endOffset: 7,
        });
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 1a: Test 2", () => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 2,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: 1,
          previouslyInsertedNodeOffset: 0,
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const receivedPage = deleteContent(page, {
          startOffset: 0,
          endOffset: 2,
        });
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 1a: Test 3", () => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: 2,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: 1,
          previouslyInsertedNodeOffset: 5,
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 2,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const receivedPage = deleteContent(page, {
          startOffset: 0,
          endOffset: 5,
        });
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 1a: Test 4", () => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 2,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: 1,
          previouslyInsertedNodeOffset: 0,
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 2,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 2,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const receivedPage = deleteContent(page, {
          startOffset: 2,
          endOffset: 7,
        });
        expect(receivedPage).toEqual(expectedPage);
      });
    });

    describe("Scenario 1b: delete from the start of a node to a point in the node", () => {
      test("Scenario 1b: Test 1", () => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: 2,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: 1,
          previouslyInsertedNodeOffset: 5,
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 1,
              lineFeedCount: 0,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: 2,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const receivedPage = deleteContent(page, {
          startOffset: 0,
          endOffset: 4,
        });
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 1b: Test 2", () => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 2,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: 1,
          previouslyInsertedNodeOffset: 0,
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 2,
              leftLineFeedCount: 0,
              length: 1,
              lineFeedCount: 0,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const receivedPage = deleteContent(page, {
          startOffset: 2,
          endOffset: 6,
        });
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 1b: Test 3", () => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 2,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: 1,
          previouslyInsertedNodeOffset: 0,
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 3 },
              end: { line: 1, column: 1 },
              leftCharCount: 2,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const receivedPage = deleteContent(page, {
          startOffset: 2,
          endOffset: 5,
        });
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 1b: Test 4", () => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 2,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: 1,
          previouslyInsertedNodeOffset: 0,
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 2 },
              end: { line: 1, column: 1 },
              leftCharCount: 2,
              leftLineFeedCount: 0,
              length: 3,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const receivedPage = deleteContent(page, {
          startOffset: 2,
          endOffset: 4,
        });
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 1b: Test 5", () => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: 2,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: 1,
          previouslyInsertedNodeOffset: 5,
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: 2,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 2 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 1,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const receivedPage = deleteContent(page, {
          startOffset: 5,
          endOffset: 6,
        });
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 1b: Test 6", () => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 2,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: 1,
          previouslyInsertedNodeOffset: 0,
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 2,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 2 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 1,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const receivedPage = deleteContent(page, {
          startOffset: 0,
          endOffset: 1,
        });
        expect(receivedPage).toEqual(expectedPage);
      });
    });

    describe("Scenario 1c: delete from a point in a node to the end of the node", () => {
      test("Scenario 1c: Test 1", () => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: 2,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: 1,
          previouslyInsertedNodeOffset: 5,
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 0, column: 2 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: 2,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const receivedPage = deleteContent(page, {
          startOffset: 2,
          endOffset: 5,
        });
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 1c: Test 2", () => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: 2,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: 1,
          previouslyInsertedNodeOffset: 5,
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 0, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 3,
              lineFeedCount: 0,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: 2,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const receivedPage = deleteContent(page, {
          startOffset: 3,
          endOffset: 5,
        });
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 1c: Test 3", () => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: 2,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: 1,
          previouslyInsertedNodeOffset: 5,
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 0, column: 4 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 4,
              lineFeedCount: 0,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: 2,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const receivedPage = deleteContent(page, {
          startOffset: 4,
          endOffset: 5,
        });
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 1c: Test 4", () => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndzef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 2 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 6,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: 2,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 2 },
              end: { line: 1, column: 4 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: 1,
          previouslyInsertedNodeOffset: 5,
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndzef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: 2,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 2 },
              end: { line: 1, column: 4 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const receivedPage = deleteContent(page, {
          startOffset: 5,
          endOffset: 6,
        });
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 1c: Test 5", () => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 2,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: 1,
          previouslyInsertedNodeOffset: 0,
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 0, column: 2 },
              leftCharCount: 2,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const receivedPage = deleteContent(page, {
          startOffset: 4,
          endOffset: 7,
        });
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 1c: Test 6", () => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: 2,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: 1,
          previouslyInsertedNodeOffset: 0,
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: 2,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 2 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 1,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const receivedPage = deleteContent(page, {
          startOffset: 6,
          endOffset: 7,
        });
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 1c: Test 7", () => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 2,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: 1,
          previouslyInsertedNodeOffset: 0,
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 2,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 2 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 1,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const receivedPage = deleteContent(page, {
          startOffset: 1,
          endOffset: 2,
        });
        expect(receivedPage).toEqual(expectedPage);
      });
    });

    describe("Scenario 1d: delete from a point in a node to another point in the node", () => {
      test("Scenario 1d: Test 1", () => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: 2,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: 1,
          previouslyInsertedNodeOffset: 5,
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 0, column: 2 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 3,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 3,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 2,
              leftLineFeedCount: 0,
              length: 1,
              lineFeedCount: 0,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 1,
              right: 2,
            },
          ],
          root: 3,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const receivedPage = deleteContent(page, {
          startOffset: 2,
          endOffset: 4,
        });
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 1d: Test 2", () => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: 2,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: 1,
          previouslyInsertedNodeOffset: 5,
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 0, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 3,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 3,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 3,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 3,
              leftLineFeedCount: 0,
              length: 1,
              lineFeedCount: 0,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 1,
              right: 2,
            },
          ],
          root: 3,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const receivedPage = deleteContent(page, {
          startOffset: 3,
          endOffset: 4,
        });
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 1d: Test 3", () => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: 2,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: 1,
          previouslyInsertedNodeOffset: 5,
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 0, column: 2 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 3,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 3,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 0, column: 3 },
              end: { line: 1, column: 1 },
              leftCharCount: 2,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 1,
              right: 2,
            },
          ],
          root: 3,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const receivedPage = deleteContent(page, {
          startOffset: 2,
          endOffset: 3,
        });
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 1d: Test 4", () => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 2,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 0, column: 2 },
              leftCharCount: 2,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: 3,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 2,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 1,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const receivedPage = deleteContent(page, {
          startOffset: 4,
          endOffset: 6,
        });
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 1d: Test 5", () => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndefgh",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: 2,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 5 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 4,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndefgh",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Red,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 2 },
              leftCharCount: 5,
              leftLineFeedCount: 1,
              length: 1,
              lineFeedCount: 0,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 1,
              right: 3,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 4 },
              end: { line: 1, column: 5 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 1,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 2,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const receivedPage = deleteContent(page, {
          startOffset: 6,
          endOffset: 8,
        });
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 1d: Test 6", () => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndefgh",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 4,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 5 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 4,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndefgh",
              lineStarts: [0, 4],
              isReadOnly: false,
            },
          ],
          newlineFormat: NEWLINE.LF,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 0,
              start: { line: 0, column: 0 },
              end: { line: 1, column: 1 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 5,
              lineFeedCount: 1,
              color: Color.Red,
              parent: 3,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 1 },
              end: { line: 1, column: 2 },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 1,
              lineFeedCount: 0,
              color: Color.Red,
              parent: 3,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 0,
              start: { line: 1, column: 4 },
              end: { line: 1, column: 5 },
              leftCharCount: 1,
              leftLineFeedCount: 0,
              length: 1,
              lineFeedCount: 0,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: 1,
            },
          ],
          root: 3,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
        };
        const receivedPage = deleteContent(page, {
          startOffset: 1,
          endOffset: 3,
        });
        expect(receivedPage).toEqual(expectedPage);
      });
    });
  });
});
