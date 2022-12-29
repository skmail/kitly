import {
  App,
  computeElementsTableTransformations,
  Element,
  ElementsState,
  Extension,
} from "@kitly/system";
import { TransformResult } from "../../element-highlighter/types";
import { Renderer } from "./renderer";
import { FrameElement } from "./types";
import { Watcher } from "./watcher";

export const frame: Extension = {
  ui: Watcher,
  elements: [
    {
      name: "frame",
      // @TODO fix the typing later
      // @ts-ignore
      renderer: Renderer,
      toString: () => "group string for now",
      modifiers: {
        transform(
          element: FrameElement,
          state: ElementsState
        ): TransformResult | void {
          let result: TransformResult = {
            elements: {},
            transformations: computeElementsTableTransformations(
              {
                ids: element.children,
                items: state.elements,
              },
              state.transformations
            ),
          };

          return result;
        },
      },
    },
  ],
  modifiers: {
    elements: {
      onSelectionFilter(
        id,
        selections: string[],
        app: App,
        lastSelections: string[]
      ) {
        selections = lastSelections || selections;
        const element = app.useElementsStore.getState().elements[id];

        if (element.type !== "frame") {
          return;
        }
        const getIds = (element: Element): string[] => {
          const ids: string[] = [];

          if (element.children) {
            ids.push(...element.children);
            for (let id of element.children) {
              const child = app.useElementsStore.getState().elements[id];
              ids.push(...getIds(child));
            }
          }

          return ids;
        };

        const ids = getIds(element);

        return selections.filter((id) => !ids.includes(id));
      },
    },
  },
};

export * from "./utils";
