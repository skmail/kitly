import {
  computeElementsTableTransformations,
  ElementsState,
} from "@kitly/system";
import { fitElementParents } from "../utils";

export function onTransform(id: string, state: ElementsState) {
  const element = state.elements[id];

  const parentId = element.parentId;

  if (!parentId) {
    return;
  }
  let group = state.elements[parentId];

  if (!group.children) {
    return;
  }

  const results = fitElementParents(id, state.elements);

  return {
    elements: results,
    transformations: computeElementsTableTransformations(
      {
        ids: Object.keys(results),
        items: results,
      },
      state.transformations,
      false
    ),
  };
}
