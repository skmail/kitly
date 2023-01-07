import {
  App,
  computeElementsTableTransformations,
  Element,
  ElementsState,
} from "@kitly/system";
import { TransformResult } from "../../../element-highlighter/types";
import {
  mergeResultToResult,
  mergeResultToState,
} from "../../../element-highlighter/utils";
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

  Object.values(result.transformations).map((transform) => {
    const old = state.transformations[transform.id];
    state.spatialTree.remove(
      {
        minX: old.bounds.xmin,
        minY: old.bounds.ymin,
        maxX: old.bounds.xmax,
        maxY: old.bounds.ymax,
        id: transform.id,
      },
      (a, b) => a.id === b.id
    );

    state.spatialTree.insert({
      minX: transform.bounds.xmin,
      minY: transform.bounds.ymin,
      maxX: transform.bounds.xmax,
      maxY: transform.bounds.ymax,
      id: transform.id,
    });
  });

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
