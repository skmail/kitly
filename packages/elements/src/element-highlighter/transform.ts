import {
  computeElementTransformations,
  Element,
  ElementsState,
  matrixTranslate,
  multiply,
  inverseAffine,
  Point,
  decompose,
  matrixScale,
  Vec,
} from "@kitly/system";
import { TransformResult } from "./types";

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
    };

    if (selectionTransformations) {
      if (payload.matrix) {
        const translation: Point = [
          selectionTransformations.worldPosition[0] -
            state.transformations[id].worldPosition[0],
          selectionTransformations.worldPosition[1] -
            state.transformations[id].worldPosition[1],
        ];

        const inverse = inverseAffine(
          prevSelectionTransformations.relativeMatrix
        );

        element.matrix = multiply(
          matrixTranslate(translation[0], translation[1]),
          multiply(payload.matrix, inverse),
          matrixTranslate(-translation[0], -translation[1]),
          element.matrix
        );

        if (element.disabledScale || true) {
          const dec = decompose(element.matrix);

          element.width +=
            Math.abs(element.width * dec.scale.sx) - element.width;

          element.height +=
            Math.abs(element.height * dec.scale.sy) - element.height;

          element.matrix = multiply(
            element.matrix,
            inverseAffine(
              matrixScale(
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
    }

    results.elements[id] = element;
    results.transformations[id] = computeElementTransformations(
      element,
      results.transformations[element.parentId || ""] ||
        state.transformations[element.parentId || ""]
    );
  }

  return results;
}
