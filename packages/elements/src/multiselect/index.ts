import { Extension, getElementIntersectedWithPoint } from "@kitly/system";
import {
  ElementRaycastResult,
  RaycastResult,
  SelectionRaycastResult,
} from "../types";
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
    post(ray) {
      let isOverHandle = false;
      let selection: SelectionRaycastResult | undefined = undefined;

      for (let r of ray.stack as RaycastResult[]) {
        if (r.type === "handle") {
          isOverHandle = true;
        }
        if (r.type === "selection") {
          selection = r;
        }
        if (selection && isOverHandle) {
          break;
        }
      }

      if (!isOverHandle && selection) {
        return selection;
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
