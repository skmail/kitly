import {
  App,
  computeElementsTableTransformations,
  ElementsState,
  transformationsToSpatialData,
} from "@kitly/system";
import { TransformResult } from "@kitly/elements/src/element-highlighter/types";
import {
  mergeResultToResult,
  mergeResultToState,
} from "@kitly/elements/src/element-highlighter/utils";
import { fitElementParents } from "../utils";

export function onTransformEnd(
  ids: string[],
  app: App
): TransformResult | undefined {
  let state = app.useElementsStore.getState();
  let result: TransformResult = {
    transformations: {},
    elements: {},
    selectionTransformations: undefined,
  };

  for (let id of ids) {
    const output = transformElement(id, state);
    if (output) {
      result = mergeResultToResult(output, result);
      state = mergeResultToState(result, state);
    }
  }

  state.spatialTree.update(
    ...transformationsToSpatialData(
      result.transformations,
      state.transformations
    )
  );

  app.useElementsStore.getState().update({
    elements: {
      ...state.elements,
      ...result.elements,
    },
    transformations: {
      ...state.transformations,
      ...result.transformations,
    },
  });

  return result;
}
const transformElement = (
  id: string,
  state: ElementsState
): TransformResult | undefined => {
  const element = state.elements[id];
  const parentId = element.parentId;

  if (!parentId) {
    return;
  }

  let parent = state.elements[parentId];

  if (parent.type !== "group") {
    return;
  }

  if (!parent.children || !parent.children.length) {
    return;
  }

  const results = fitElementParents(id, state.elements, state.transformations);

  if (!results.root) {
    return;
  }

  const transformations = computeElementsTableTransformations(
    {
      ids: [results.root],
      items: {
        ...state.elements,
        ...results.elements,
      },
    },
    state.transformations
  );

  return {
    elements: results.elements,
    transformations,
  };
};
