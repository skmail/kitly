import { App, Element, ElementsState } from "@kitly/system";
import { transform } from "../transform";
import { TransformResult } from "../types";
import { mergeResultToResult, mergeResultToState } from "../utils";

export function _transform(
  ids: string[],
  payload: Partial<Element>,
  state: ElementsState,
  app: App
): TransformResult {
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
        originalState,
        app
      );
      if (extensionResults !== undefined) {
        // the root selectionTransformations shouldn't be replaced
        // with any inner transformations
        const { selectionTransformations, ...rest } = extensionResults;
        result = mergeResultToResult(rest, result);
        state = mergeResultToState(result, state);
      }
    }

    const appModifiersResult = app.elements?.onTransform?.(id, state, result);

    if (appModifiersResult !== undefined) {
      result = mergeResultToResult(appModifiersResult, result);
      state = mergeResultToState(result, state);
    }
  }


  return result;
}
