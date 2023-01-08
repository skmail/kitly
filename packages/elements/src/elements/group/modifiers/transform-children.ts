import { App, ElementsState, matrixScale, multiply } from "@kitly/system";
import { TransformResult } from "../../../element-highlighter/types";
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
}
