import { ElementsState } from "@kitly/system";
import { TransformResult } from "./types";

export const mergeResultToState = (
  result: TransformResult,
  state: ElementsState
) => {
  return {
    ...state,
    elements: {
      ...state.elements,
      ...result.elements,
    },
    transformations: {
      ...state.transformations,
      ...result.transformations,
    },
  };
};

export const mergeResultToResult = (
  result: TransformResult,
  originalResult: TransformResult
): TransformResult => {
  return {
    ...originalResult,
    selectionTransformations:
      result.selectionTransformations ||
      originalResult.selectionTransformations,

    elements: {
      ...originalResult.elements,
      ...result.elements,
    },

    transformations: {
      ...originalResult.transformations,
      ...result.transformations,
    },
  };
};
