import { App, Element, ElementsState, Point } from "@kitly/system";
const getIds = (
  element: Element,
  state: ElementsState
): Record<string, string> => {
  let ids: Record<string, string> = {};

  if (element.children) {
    ids = {
      ...ids,
      ...element.children.reduce(
        (acc, id) => ({
          ...acc,
          [id]: id,
        }),
        {}
      ),
    };
    for (let id of element.children) {
      const child = state.elements[id];
      ids = {
        ...ids,
        ...getIds(child, state),
      };
    }
  }

  return ids;
};

export function onSelectionFilter(
  id: string,
  selections: string[],
  collisionPoints: Point[],
  app: App,
  lastSelections: string[]
) {
  selections = lastSelections || selections;
  const state = app.useElementsStore.getState();
  const element = state.elements[id];

  if (element.type !== "group") {
    return;
  }

  const ids = getIds(element, state);

  const selectionsWithoutChildren = selections.filter((id) => !ids[id]);

  if (selectionsWithoutChildren.length !== selections.length) {
    return selectionsWithoutChildren;
  }

  return selectionsWithoutChildren.filter((id) => id !== element.id);
}
