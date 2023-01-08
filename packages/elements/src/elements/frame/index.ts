import { App, ElementsState, Extension } from "@kitly/system";
import { TransformResult } from "../../element-highlighter/types";
import { Renderer } from "./renderer";
import { FrameElement } from "./types";
import { Watcher } from "./watcher";

const getIds = (id: string, elements: ElementsState["elements"]): string[] => {
  const ids: string[] = [];
  const element = elements[id];
  if (element.children) {
    ids.push(...element.children);
    for (const id of element.children) {
      ids.push(...getIds(id, elements));
    }
  }

  return ids;
};

export const frame: Extension = {
  ui: {
    static: Watcher,
  },
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
        const elements = app.useElementsStore.getState().elements;
        const element = elements[id];

        if (element.type !== "frame") {
          return;
        }

        const ids = getIds(element.id, elements);

        return selections.filter((id) => !ids.includes(id));
      },
    },
  },
};

export * from "./utils";
