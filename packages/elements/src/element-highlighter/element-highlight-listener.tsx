import { RaycastResult } from "../types";
import { useEffect } from "react";
import { useApp } from "@kitly/app";
import { App, shallowEqual } from "@kitly/system";
import { ElementHighlighterExtension } from "./types";

export const ElementHighlightListener = () => {
  const app = useApp<[ElementHighlighterExtension]>();

  const ray = app.useRaycastStore(
    (state) => state.rays[0] as RaycastResult,
    shallowEqual
  );

  const [isDown, mouse] = app.useMouseStore(
    (state) => [state.isDown, state.mouse],
    shallowEqual
  );
 
  useEffect(() => { 
    if (
      ray?.type === "selection" ||
      app.stores.useTransformStore.getState().isTransforming
    ) {
      return;
    }

    if (isDown) {
      if (ray?.type === "element") {
        app.useElementsStore.getState().select([ray?.id]);
      } else if (ray?.type !== "handle") {
        app.useElementsStore.getState().select([]);
      }
    } else if (ray?.type === "element") {
      app.useElementsStore.getState().hover(ray?.id);
      return;
    }
    app.useElementsStore.getState().hover("");
  }, [
    app.stores.useTransformStore,
    app.useElementsStore,
    app.useMouseStore,
    isDown,
    mouse,
    ray,
  ]);

  return null;
};
