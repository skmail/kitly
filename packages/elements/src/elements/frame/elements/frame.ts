import { App, ElementExtension, ElementsState } from "@kitly/system";
import { TransformResult } from "../../../element-highlighter/types";
import { FrameElement } from "../types";
import { Renderer } from "./renderer";

export const frame: ElementExtension = {
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
};
