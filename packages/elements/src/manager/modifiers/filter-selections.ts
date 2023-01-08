import { App, Point } from "@kitly/system";

export function filterSelections(
  ids: string[],
  collisionPoints: Point[],
  app: App,
  lastValue?: string[]
) {
  let newIds = lastValue || ids;
  for (let id of ids) {
    if (!newIds.includes(id)) {
      continue;
    }
    const updatedIds = app.elements.onSelectionFilter(
      id,
      newIds,
      collisionPoints
    );

    if (updatedIds !== undefined) {
      newIds = updatedIds;
    }
  }
  return newIds;
}
