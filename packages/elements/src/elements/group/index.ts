import { ElementsState, Extension, App, Element } from "@kitly/system";
import { transform } from "../../element-highlighter/transform";
import { TransformResult } from "../../element-highlighter/types";
import { mergeResultToResult } from "../../element-highlighter/utils";
import { Renderer } from "./renderer";
import { GroupElement } from "./types";
import { Watcher } from "./watcher";
import { onTransform } from "./modifiers/on-transform";
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
          prevState: ElementsState
        ): TransformResult | void {
          if (element.type !== "group") {
            return;
          }
          let result = transform(element.children, element, {
            ...prevState,
            selectionTransformations: prevState.transformations[element.id],
          });

          for (let id of element.children) {
            const child = state.elements[id];

            if (child.type !== "group" || !child.children?.length) {
              continue;
            }

            result = mergeResultToResult(
              transform(child.children, result.elements[child.id], {
                ...prevState,
                selectionTransformations: prevState.transformations[child.id],
              }),
              result
            );
          }

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
      onTransform,
    },
  },
};

export * from "./utils";
