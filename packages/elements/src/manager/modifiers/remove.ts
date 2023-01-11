import { App, ElementsState } from "@kitly/system";

const getIds = (ids: string[], state: ElementsState) => {
  const result: string[] = [];
  for (let id of ids) {
    const element = state.elements[id];
    if (element.children?.length) {
      result.push(...getIds(element.children, state));
    }
    result.push(id);
  }
  return result;
};

export function remove(ids: string[], app: App) {
  const state = app.useElementsStore.getState();
  ids = getIds(ids, state);

  state.deleteElement(ids);

  for (let id of ids) {
    state.spatialTree.remove(
      {
        minX: state.transformations[id].bounds.xmin,
        minY: state.transformations[id].bounds.ymin,
        maxX: state.transformations[id].bounds.xmax,
        maxY: state.transformations[id].bounds.ymax,
        id,
        type: "element",
      },
      (a, b) => {
        return a.id === b.id && a.type === b.type;
      }
    );
  }

  // console.log(
  //   state.spatialTree
  // )
}
