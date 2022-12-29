import {
  App,
  arrayToTable,
  computeElementsTableTransformations,
  Element,
} from "@kitly/system";

export function addFromTree(elements: Element[], app: App) {
  const table = elementsArrayToTable(elements);
  const transformations = computeElementsTableTransformations(table);

  const state = app.useElementsStore.getState();

  Object.values(transformations).map((transform) => {
    state.spatialTree.insert({
      minX: transform.bounds.xmin,
      minY: transform.bounds.ymin,
      maxX: transform.bounds.xmax,
      maxY: transform.bounds.ymax,
      id: transform.id,
    });
  });

  state.update({
    elements: {
      ...state.elements,
      ...table.items,
    },
    ids: [...state.ids, ...table.ids],
    transformations: {
      ...state.transformations,
      ...transformations,
    },
  });
}

function elementsArrayToTable(elements: Element[], parentId?: string) {
  return arrayToTable(elements, (element, acc) => {
    if (element.children) {
      const table = elementsArrayToTable(element.children, element.id);
      acc.items = {
        ...acc.items,
        ...table.items,
      };
      element = {
        ...element,
        children: table.ids,
      };
    }

    return {
      ...element,

      parentId,
    };
  });
}
