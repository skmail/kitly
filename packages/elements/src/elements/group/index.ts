import {
  ElementsState,
  Extension,
  App,
  multiply,
  matrixScale,
} from "@kitly/system";
import { TransformResult } from "../../element-highlighter/types";
import { Renderer } from "./renderer";
import { GroupElement } from "./types";
import { Watcher } from "./watcher";
import { onTransformEnd } from "./modifiers/on-transform";
import { onSelectionFilter } from "./modifiers/on-selection-filter";
export const group: Extension = {
  ui: Watcher,
  elements: [
    {
      name: "group",
      // @TODO fix the typing later
      // @ts-ignore
      renderer: Renderer,
      toString: () => "group string for now",
      transformRenderrer: false,
      modifiers: {
        transform(
          element: GroupElement,
          state: ElementsState,
          prevState: ElementsState,
          app: App
        ): TransformResult | void {
          let result = app.elements.transform(
            element.children,
            { 
              matrix: multiply(
                element.matrix,
                matrixScale(
                  element.width / prevState.transformations[element.id].width,
                  element.height / prevState.transformations[element.id].height
                )
              ),
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
    transform: {
      aspectRatio(selected: string[], app: App) {
        if (selected.length === 0) {
          return;
        }
        return (
          selected.length > 1 ||
          selected.some(
            (id) =>
              app.useElementsStore.getState().elements[id]?.type === "group"
          )
        );
      },
    },
    elements: {
      onSelectionFilter,
      onTransformEnd,
    },
  },
  raycast: {
    post(ray, app) {},
  },
};

export * from "./utils";
