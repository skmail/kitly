import { RaycastResult } from "../types";
import { useEffect } from "react";
import { useApp } from "@kitly/app";
import { App } from "@kitly/system";
import { ExtensionDefinition } from "./types";

export const ElementHighlightListener = () => {
  const app = useApp<App<[ExtensionDefinition]>>();

  const ray = app.useRaycastStore((state) => state.ray as RaycastResult);

  const [isDown, mouse] = app.useMouseStore((state) => [
    state.isDown,
    state.mouse,
  ]);

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
        console.log("SELECT");
      } else if (ray?.type !== "handle") {
        app.useElementsStore.getState().select([]);
        console.log("UNSELECT");
      }
    } else if (ray?.type === "element") {
      app.useElementsStore.getState().hover(ray?.id);
      return;
    }
    app.useElementsStore.getState().hover("");
  }, [app.useElementsStore, app.useMouseStore, isDown, mouse, ray]);

  return null;
};
