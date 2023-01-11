import {
  App,
  Element,
  SpatialElement,
  transformationsToSpatialData,
} from "@kitly/system";
import { TransformResult } from "../types";

export function update(
  ids: string[],
  payload: Partial<Element>,
  app: App,
  updates: any
) {
  const state = app.useElementsStore.getState();

  const result = app.elements.transform(ids, payload, state) as TransformResult;

  if (!result) {
    return;
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
    selectionTransformations: result.selectionTransformations,
  });
}
