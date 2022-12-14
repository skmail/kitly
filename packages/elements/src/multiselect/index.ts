import { Extension, getElementIntersectedWithPoint } from "@kitly/system";
import { Multiselect } from "./multiselect";

export const multiselect: Extension = {
  ui: Multiselect,
  raycast: {
    validate(app) {
      const ray = app.useRaycastStore.getState().ray;
      if (app.useMouseStore.getState().isDown && ray?.type === "selection") {
        return false;
      }
    },
    raycast(app) {
      const transformations =
        app.useElementsStore.getState().selectionTransformations
          .transformations;

      if (!transformations) {
        return;
      }
      const mouse = app.useMouseStore.getState().mouse;

      const ray = getElementIntersectedWithPoint(
        mouse,
        {
          ids: ["__selection__"],
          elements: {
            __selection__: {
              id: "__selection__",
              type: "selection",
              x: transformations.x,
              y: transformations.y,
              matrix: transformations.affineMatrix,
              width: transformations.width,
              height: transformations.height,
            },
          },
        },
        {
          __selection__: transformations,
        }
      );

      if (ray) {
        return {
          type: "selection",
        };
      }
    },
  },
};
