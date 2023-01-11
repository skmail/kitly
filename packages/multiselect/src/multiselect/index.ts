import { Extension, Collision } from "@kitly/system";
import { SelectionRaycastResult } from "../../../elements/src/types";
import { Multiselect } from "./multiselect";

export const multiselect: Extension = {
  ui: {
    pannable: Multiselect,
  },
  raycast: {
    validate(app) {
      const rays = app.useRaycastStore.getState().rays;
      if (
        app.useMouseStore.getState().isDown &&
        rays[0]?.type === "selection"
      ) {
        return false;
      }
    },
    post(rays, app) {
      let isOverHandle = false;
      let selection: SelectionRaycastResult | undefined = undefined;

      for (let r of rays) {
        if (r.type === "handle") {
          isOverHandle = true;
        }
        if (r.type === "selection") {
          selection = r as SelectionRaycastResult;
        }
        if (selection && isOverHandle) {
          break;
        }
      }

      if (!isOverHandle && selection) {
        return [selection, ...rays];
      }
    },
    raycast(app) {
      const transformations =
        app.useElementsStore.getState().selectionTransformations;

      if (!transformations) {
        return;
      }
      const mouse = app.useMouseStore.getState().mouse;

      if (Collision.points([mouse], transformations.points)) {
        return [
          {
            type: "selection",
          },
        ];
      }
    },
  },
};
