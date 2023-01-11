import { App, ElementExtension, ElementsState, minMax } from "@kitly/system";
import { FrameTitleUtils } from "../frame-title-utils";
import { FrameElement } from "../types";
import { Icon } from "./icon";
import { Renderer } from "./renderer";
import { TransformResult } from "@kitly/elements/src/element-highlighter/types";

export const frame: ElementExtension = {
  name: "frame",
  // @TODO fix the typing later
  // @ts-ignore
  renderer: Renderer,
  toString: () => "group string for now",
  transformRenderrer: false,
  icon: Icon,

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

      if (!element.parentId) {
        const oldBounds = minMax(
          FrameTitleUtils.points(
            FrameTitleUtils.info(prevState.transformations[element.id])
          )
        );
        const bounds = minMax(
          FrameTitleUtils.points(
            FrameTitleUtils.info(state.transformations[element.id])
          )
        );

        state.spatialTree.update(
          {
            minX: bounds.xmin,
            minY: bounds.ymin,
            maxX: bounds.xmax,
            maxY: bounds.ymax,
            id: element.id,
            type: "frame-title",
          },
          {
            minX: oldBounds.xmin,
            minY: oldBounds.ymin,
            maxX: oldBounds.xmax,
            maxY: oldBounds.ymax,
            id: element.id,
            type: "frame-title",
          }
        );
      }

      // console.log(
      //   state.spatialTree
      // )

      return result;
    },
  },
};
