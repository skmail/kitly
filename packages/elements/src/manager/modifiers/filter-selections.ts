import { App } from "@kitly/system";

export function filterSelections(
  ids: string[],
  app: App,
  lastValue?: string[]
) {
  let newIds = lastValue || ids;
  for (let id of ids) {
    if (!newIds.includes(id)) {
      continue;
    }
    const updatedIds = app.elements.onSelectionFilter(id, newIds);

    if (updatedIds !== undefined) {
      newIds = updatedIds;
    }
  }
  return newIds;
}
