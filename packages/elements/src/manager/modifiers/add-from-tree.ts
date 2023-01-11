import {
  App,
  arrayToTable,
  computeElementsTableTransformations,
  Element,
  transformationsToSpatialData,
} from "@kitly/system";

export function addFromTree(elements: Element[], app: App) {
  const table = elementsArrayToTable(elements);
  const transformations = computeElementsTableTransformations(table);

  const state = app.useElementsStore.getState();

  state.spatialTree.load(transformationsToSpatialData(transformations));
  
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

  return {
    elements,
    transformations,
  };
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
