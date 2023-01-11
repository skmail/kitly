import {
  computeElementTransformations,
  Element,
  ElementsState,
  Point,
  ElementTransformationDetails,
  Mat,
} from "@kitly/system";
import { TransformResult } from "./types";

const applyToElement = (
  payload: Partial<Element>,
  element: Element,
  selectionTransformations: ElementTransformationDetails,
  transformations: ElementTransformationDetails,
  prevSelectionTransformations: ElementTransformationDetails
) => {
  element = { ...element };
  if (payload.matrix) {
    const translation: Point = [
      selectionTransformations.worldPosition[0] -
        transformations.worldPosition[0],
      selectionTransformations.worldPosition[1] -
        transformations.worldPosition[1],
    ];

    const inverse = Mat.inverse(prevSelectionTransformations.relativeMatrix);

    element.matrix = Mat.multiply(
      Mat.translate(translation[0], translation[1]),
      Mat.multiply(payload.matrix, inverse),
      Mat.translate(-translation[0], -translation[1]),
      element.matrix
    );

    if (element.disabledScale || true) {
      const dec = Mat.decompose(element.matrix);

      element.width += Math.abs(element.width * dec.scale.sx) - element.width;

      element.height +=
        Math.abs(element.height * dec.scale.sy) - element.height;

      element.matrix = Mat.multiply(
        element.matrix,
        Mat.inverse(
          Mat.scale(
            dec.scale.sx * Math.sign(dec.scale.sx),
            dec.scale.sy * Math.sign(dec.scale.sy)
          )
        )
      );
    }
  }

  if (payload.x !== undefined) {
    element.x += payload.x - prevSelectionTransformations.x;
  }

  if (payload.y !== undefined) {
    element.y += payload.y - prevSelectionTransformations.y;
  }

  return element;
};

function isTransformChange(payload: Partial<Element>) {
  return [
    payload.matrix,
    payload.width,
    payload.height,
    payload.disabledScale,
    payload.x,
    payload.y,
    payload.warp,
  ].some((value) => value !== undefined);
}
export function transform(
  ids: string[],
  payload: Partial<Element>,
  state: ElementsState
) {
  const results: TransformResult = {
    transformations: {},
    elements: {},
    selectionTransformations: undefined,
  };

  if (!isTransformChange(payload) || !state.selectionTransformations) {
    return results;
  }

  let selectionTransformations = state.selectionTransformations;
  let prevSelectionTransformations = state.selectionTransformations;

  selectionTransformations = computeElementTransformations(
    {
      type: "_selection_",
      id: selectionTransformations.id,
      width: selectionTransformations.width,
      height: selectionTransformations.height,
      matrix: selectionTransformations.affineMatrix,
      x: selectionTransformations.x,
      y: selectionTransformations.y,
      disabledScale: selectionTransformations.disabledScale,
      ...payload,
    },

    state.transformations[
      state.elements[selectionTransformations.id || ""]?.parentId || ""
    ]
  );

  results.selectionTransformations = selectionTransformations;

  for (let id of ids) {
    const element: Element = {
      ...state.elements[id],
      ...applyToElement(
        payload,
        state.elements[id],
        selectionTransformations,
        state.transformations[id],
        prevSelectionTransformations
      ),
    };

    results.elements[id] = element;
    results.transformations[id] = computeElementTransformations(
      element,
      results.transformations[element.parentId || ""] ||
        state.transformations[element.parentId || ""]
    );
  }

  return results;
}
