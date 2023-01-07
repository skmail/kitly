import { App, Element } from "@kitly/system";
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
    selectionTransformations: result.selectionTransformations,
  });
}
