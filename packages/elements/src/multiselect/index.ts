import { Extension, satCollision } from "@kitly/system";
import { RaycastResult, SelectionRaycastResult } from "../types";
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
        app.useElementsStore.getState().selectionTransformations;

      if (!transformations) {
        return;
      }
      const mouse = app.useMouseStore.getState().mouse;

      if (satCollision([mouse], transformations.points)) {
        return {
          type: "selection",
        };
      }
    },
  },
};
