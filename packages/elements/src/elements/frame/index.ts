import {
  App,
  computeElementsTableTransformations,
  Element,
  ElementsState,
  Extension,
} from "@kitly/system";
import { transform } from "../../element-highlighter/transform";
import { TransformResult } from "../../element-highlighter/types";
import { mergeResultToResult } from "../../element-highlighter/utils";
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
      transformRenderrer: false,
      modifiers: {
        transform(
          element: FrameElement,
          state: ElementsState,
          prevState: ElementsState,
          app: App
        ): TransformResult | void {
          let result = app.elements.transform(
            element.children,
            {
              matrix: element.matrix,
            },
            {
              ...prevState,
              selectionTransformations: prevState.transformations[element.id],
            }
          );

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
