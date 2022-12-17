import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import {
  Element,
  computeElementTransformations,
  computeElementsTableTransformations,
  arrayToTable,
  ElementsState,
  identity,
  minMax,
  Point,
  ElementTransformationDetails,
  multiply,
  matrixTranslate,
  SpatialTree,
} from "@kitly/system";

export const useElementsStore = create(
  subscribeWithSelector<ElementsState>((set) => ({
    spatialTree: new SpatialTree(),
    hovered: undefined,
    selected: [],
    transformations: {},
    selectionTransformations: {
      transformations: undefined,
      originals: {},
      original: undefined,
    },
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
        let originals: Record<string, ElementTransformationDetails> = {};

        if (ids.length === 1) {
          selectionTransformations = state.transformations[ids[0]];
          originals[ids[0]] = selectionTransformations;
        } else if (ids.length > 1) {
          const data = ids.reduce<{
            points: Point[];
            originals: Record<string, ElementTransformationDetails>;
          }>(
            (acc, id) => {
              const transformation = state.transformations[id];
              if (!transformation) {
                return acc;
              }

              return {
                points: [
                  ...acc.points,
                  [transformation.bounds.xmin, transformation.bounds.ymin],
                  [transformation.bounds.xmax, transformation.bounds.ymax],
                ],
                originals: {
                  ...acc.originals,
                  [id]: transformation,
                },
              };
            },
            {
              points: [],
              originals: {},
            }
          );

          const box = minMax(data.points);
          originals = data.originals;
          selectionTransformations = computeElementTransformations({
            id: "_selection_",
            type: "_selection_",
            x: box.xmin,
            y: box.ymin,
            width: box.width,
            height: box.height,
            matrix: identity(),
          });
        }
        return {
          ...state,
          selected: ids,
          selectionTransformations: {
            originals,
            original: selectionTransformations,
            transformations: selectionTransformations,
          },
        };
      }),
    elements: {},
    ids: [],

    update: (ids, payload) =>
      set((state) => {
        if (!Array.isArray(ids)) {
          ids = [ids];
        }

        let selectionTransformations =
          state.selectionTransformations.transformations;

        if (selectionTransformations) {
          selectionTransformations = computeElementTransformations({
            type: "_selection_",
            ...selectionTransformations,
            matrix: selectionTransformations.affineMatrix,
            ...payload,
          });
        }

        const result = ids.reduce<{
          elements: Record<string, Element>;
          transformations: Record<string, ElementTransformationDetails>;
        }>(
          (acc, id) => {
            let transformations = state.transformations[id];
            const element: Element = {
              ...state.elements[id],
              ...payload,
            };

            const originalElementTransformation =
              state.selectionTransformations.originals[id];

            const originalSelectionTransformation =
              state.selectionTransformations.original;

            if (originalSelectionTransformation && state.selected.length > 1) {
              if (payload.matrix) {
                const diff = [
                  originalSelectionTransformation.bounds.xmin -
                    originalElementTransformation.x,
                  originalSelectionTransformation.bounds.ymin -
                    originalElementTransformation.y,
                ];

                element.matrix = multiply(
                  matrixTranslate(diff[0], diff[1]),
                  payload.matrix,
                  matrixTranslate(-diff[0], -diff[1]),
                  originalElementTransformation.affineMatrix
                );
              }

              if (payload.x !== undefined) {
                element.x =
                  originalElementTransformation.x +
                  (payload.x - originalSelectionTransformation.x);
              }

              if (payload.y !== undefined) {
                element.y =
                  originalElementTransformation.y +
                  (payload.y - originalSelectionTransformation.y);
              }
            }

            if (
              !transformations ||
              payload.matrix ||
              payload.height ||
              payload.disabledScale !== undefined ||
              payload.x ||
              payload.y ||
              payload.warp
            ) {
              transformations = computeElementTransformations(element);
            }

            return {
              ...acc,
              transformations: {
                ...acc.transformations,
                [id]: transformations,
              },
              elements: {
                ...acc.elements,
                [id]: element,
              },
            };
          },
          { transformations: {}, elements: {} }
        );

        Object.values(result.transformations).map((transform) => {
          const old = state.transformations[transform.id];

          state.spatialTree.remove(
            {
              minX: old.bounds.xmin,
              minY: old.bounds.ymin,
              maxX: old.bounds.xmax,
              maxY: old.bounds.ymax,
              id: transform.id,
            },
            (a, b) => a.id === b.id
          );
          state.spatialTree.insert({
            minX: transform.bounds.xmin,
            minY: transform.bounds.ymin,
            maxX: transform.bounds.xmax,
            maxY: transform.bounds.ymax,
            id: transform.id,
          });
        });

        return {
          ...state,
          elements: {
            ...state.elements,
            ...result.elements,
          },
          transformations: {
            ...state.transformations,
            ...result.transformations,
          },
          selectionTransformations: {
            ...state.selectionTransformations,
            transformations: selectionTransformations,
          },
        };
      }),

    deleteElement: (ids) =>
      set((state) => {
        for (let id of ids) {
          state.spatialTree.remove(
            {
              minX: 0,
              minY: 0,
              maxX: 0,
              maxY: 0,
              id,
            },
            (a, b) => a.id === b.id
          );
        }
        return {
          ...state,
          ids: state.ids.filter((id) => !ids.includes(id)),
        };
      }),
    addMany: (elements) =>
      set((state) => {
        const elementsArrayToTable = (elements: Element[]) => {
          return arrayToTable(elements, (element, acc) => {
            if (element.children) {
              const table = elementsArrayToTable(element.children);
              acc.items = {
                ...acc.items,
                ...table.items,
              };
              element = {
                ...element,
                children: table.ids,
              };
            }

            return element;
          });
        };
        const table = elementsArrayToTable(elements);
        const transformations = computeElementsTableTransformations(table);
        Object.values(transformations).map((transform) => {
          state.spatialTree.insert({
            minX: transform.bounds.xmin,
            minY: transform.bounds.ymin,
            maxX: transform.bounds.xmax,
            maxY: transform.bounds.ymax,
            id: transform.id,
          });
        });
        return {
          ...state,
          elements: {
            ...state.elements,
            ...table.items,
          },
          ids: [...state.ids, ...table.ids],
          transformations: {
            ...state.transformations,
            ...transformations,
          },
        };
      }),
  }))
);
