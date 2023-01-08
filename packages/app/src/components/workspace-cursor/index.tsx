import { useEffect, useRef } from "react";
import { useApp } from "../../app-provider";
import {
  shallowEqual,
  getElementHandleInfo,
  getRotatedImage,
} from "@kitly/system";

import {
  ElementRaycastResult,
  HandleRaycastResult,
} from "@kitly/elements/src/types";

export function WorkspaceCursor() {
  const app = useApp();

  const ray = app.useRaycastStore(
    (state) => state.rays[0] as HandleRaycastResult | ElementRaycastResult,
    shallowEqual
  );
  const mouse = app.useMouseStore((state) => state.mouse, shallowEqual);

  useEffect(() => {
    const overlay = app.dom.workspace;

    if (!overlay) {
      return;
    }

    if (!ray) {
      overlay.style.cursor = "auto";
      return;
    }

    if (ray.type === "handle") {
      const selectionTransformations =
        app.useElementsStore.getState().selectionTransformations;
      if (selectionTransformations) {
        const angle = getElementHandleInfo({
          handle: ray.handle,
          transformations: selectionTransformations,
        }).directionAngle;
        getRotatedImage(angle, ray.mode).then((img) => {
          overlay.style.cursor = `url(${img}) 14 16, auto`;
        });
      }
      return;
    }
    overlay.style.cursor = "auto";
  }, [app.dom.workspace, app.useElementsStore, mouse, ray]);

  return null;
}
