import {
  App,
  Collision,
  CollisionMode,
  ElementsState,
  Point,
  Tuple,
} from "@kitly/system";

const getIds = (id: string, elements: ElementsState["elements"]): string[] => {
  const ids: string[] = [];
  const element = elements[id];
  if (element.children) {
    ids.push(...element.children);
    for (const id of element.children) {
      ids.push(...getIds(id, elements));
    }
  }

  return ids;
};

export function onSelectionFilter(
  id: string,
  selections: string[],
  collisionPoints: Tuple<Point, 4>,
  app: App,
  lastSelections: string[]
) {
 
  selections = lastSelections || selections;
  const state = app.useElementsStore.getState();
  const elements = state.elements;
  const element = elements[id];

  if (element.type !== "frame") {
    return;
  }

  if (
    Collision.boxToPoints(
      collisionPoints,
      state.transformations[element.id].points,
      CollisionMode.Cover
    )
  ) {
    const ids = getIds(element.id, elements);
    return selections.filter((id) => !ids.includes(id));
  }
  return selections.filter((id) => id !== element.id);
}
