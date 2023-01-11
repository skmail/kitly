import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import {
  Element,
  computeElementTransformations,
  ElementsState,
  Mat,
  minMax,
  Point,
  SpatialTree,
} from "@kitly/system";

interface ElementTree extends Omit<Element, "children"> {
  children?: ElementTree[];
}
export const useElementsStore = create(
  subscribeWithSelector<ElementsState>((set) => ({
    // this is a mutable object, kept it mutable for performance reasons.
    // copy the results if you needed to make any decisions based on tree history.
    spatialTree: new SpatialTree(),
    hovered: undefined,
    selected: [],
    transformations: {},
    selectionTransformations: undefined,

    globalPosition: {},

    hover: (id) =>
      set((state) => {
        return {
          ...state,
          hovered: id,
        };
      }),

    select: (ids = []) =>
      set((state) => {
        let selectionTransformations;

        if (ids.length === 1) {
          selectionTransformations = {
            ...state.transformations[ids[0]],
            id: "__selection__",
            x: state.transformations[ids[0]].worldPosition[0],
            y: state.transformations[ids[0]].worldPosition[1],
          };
        } else if (ids.length > 1) {
          const data = ids.reduce<Point[]>((acc, id) => {
            const transformation = state.transformations[id];
            if (!transformation) {
              return acc;
            }
            return [
              ...acc,
              [transformation.bounds.xmin, transformation.bounds.ymin],
              [transformation.bounds.xmax, transformation.bounds.ymax],
            ];
          }, []);

          const box = minMax(data);
          selectionTransformations = computeElementTransformations({
            id: "_selection_",
            type: "_selection_",
            x: box.xmin,
            y: box.ymin,
            width: box.width,
            height: box.height,
            matrix: Mat.identity(),
          });
        }
        return {
          ...state,
          selected: ids,
          selectionTransformations,
        };
      }),
    elements: {},
    ids: [],

    update: (updatedState) =>
      set((state) => {
        return {
          ...state,
          ...updatedState,
        };
      }),

    deleteElement: (ids) =>
      set((state) => {
        for (let id of ids) {
          const parentId = state.elements[id].parentId;
          if (!parentId) {
            state = {
              ...state,
              ids: state.ids.filter((id) => !ids.includes(id)),
            };
          } else {
            const children = state.elements[parentId].children;

            state = {
              ...state,
              elements: {
                ...state.elements,
                [parentId]: {
                  ...state.elements[parentId],
                  children: children
                    ? children.filter((id) => !ids.includes(id))
                    : [],
                },
              },
            };
          }
        }
        return state;
      }),
  }))
);
