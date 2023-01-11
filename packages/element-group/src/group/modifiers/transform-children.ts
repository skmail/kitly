import { App, ElementsState, Mat } from "@kitly/system";
import { TransformResult } from "@kitly/elements/src/element-highlighter/types";
import { GroupElement } from "../types";

export function transformChildren(
  element: GroupElement,
  state: ElementsState,
  prevState: ElementsState,
  app: App
): TransformResult | void {
  let result = app.elements.transform(
    element.children,
    {
      matrix: Mat.multiply(
        element.matrix,
        Mat.scale(
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
}
