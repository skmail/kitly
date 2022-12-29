import { App, Element } from "@kitly/system";
import { transform } from "../transform";
import { mergeResultToResult, mergeResultToState } from "../utils";

export function update(ids: string[], payload: Partial<Element>, app: App) {
  console.log("update")
  let state = app.useElementsStore.getState();
  const originalState = state;

  let result = transform(ids, payload, state);

  state = mergeResultToState(result, state);

  for (let id of ids) {
    const element = state.elements[id];
    const extension = app.extensions.elements.get(element.type);

    if (extension?.modifiers?.transform) {
      const extensionResults = extension.modifiers?.transform(
        element,
        state,
        originalState
      );
      if (extensionResults !== undefined) {
        // the root selectionTransformations shouldn't be replaced
        // with any inner transformations
        const { selectionTransformations, ...rest } = extensionResults;
        result = mergeResultToResult(rest, result);
        state = mergeResultToState(result, state);
      }
    }

    const appModifiersResult = app.elements.onTransform(id, state);

    if (appModifiersResult !== undefined) {
      result = mergeResultToResult(appModifiersResult, result);
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
    selectionTransformations: result.selectionTransformations,
  });
}
