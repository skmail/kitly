import { App, Element, ElementsState } from "@kitly/system";
const getIds = (element: Element, state: ElementsState): string[] => {
  const ids: string[] = [];

  if (element.children) {
    ids.push(...element.children);
    for (let id of element.children) {
      const child = state.elements[id];
      ids.push(...getIds(child, state));
    }
  }

  return ids;
};

export function onSelectionFilter(
  id: string,
  selections: string[],
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

  return selections.filter((id) => !ids.includes(id));
}
