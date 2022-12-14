import { rotate, scale, translate } from "@free-transform/core";

import { shallowEqual, MouseButton, Element, App } from "@kitly/system";
import { useEffect, useRef } from "react";
import { useApp } from "../../../app/src/app-provider";
import { usePrevious } from "../../../app/src/hooks/usePrevious";
import { RaycastResult } from "../types";

import { FreeTransformElement } from "./free-transform-element";
import { ExtensionDefinition } from "./types";

export function SelectionTransform() {
  const app = useApp<App<[ExtensionDefinition]>>();

  const selectionTransformations = app.useElementsStore(
    (state) => state.selectionTransformations.transformations,
    shallowEqual
  );

  const isSelecting = app.stores.useTransformStore(
    (state) => state.isSelecting
  );

  const offset = app.useWorkspaceStore((state) => state.offset, shallowEqual);

  const ray = app.useRaycastStore(
    (state) => state.ray as RaycastResult,
    shallowEqual
  );

  const mouse = app.useMouseStore(
    ({ isDown, mouse, button }) => ({
      isDown,
      mouse,
      button,
    }),
    shallowEqual
  );
  const transformer = useRef<any>();
  const prev = usePrevious({
    mouse,
  });

  useEffect(() => {
    if (mouse.button !== MouseButton.LEFT || !ray || !mouse.isDown) {
      transformer.current = undefined;
      if (app.stores.useTransformStore.getState().isTransforming) {
        app.stores.useTransformStore.getState().setTransform(false);
      }
      return;
    }

    const selected = app.useElementsStore.getState().selected;

    if (!selected.length) {
      return;
    }

    const onChange = (changes: Partial<Element>) => {
      app.useElementsStore
        .getState()
        .update(app.useElementsStore.getState().selected, changes);
    };

    if (mouse.isDown && !transformer.current) {
      const transformations =
        app.useElementsStore.getState().selectionTransformations
          .transformations;

      if (!transformations) {
        return;
      }

      if (ray.type === "element" || ray.type === "selection") {
        app.stores.useTransformStore.getState().setTransform(true, "translate");
        transformer.current = translate(
          {
            start: mouse.mouse,
            x: transformations.x,
            y: transformations.y,
          },
          (payload) => {
            onChange(payload);
          }
        );
      } else if (ray.mode === "scale") {
        app.stores.useTransformStore.getState().setTransform(true, "scale");
        transformer.current = scale(
          ray.handle,
          {
            start: mouse.mouse,
            width: transformations.baseWidth,
            height: transformations.baseHeight,
            matrix: transformations.relativeMatrix,
            affineMatrix: transformations.affineMatrix,
            perspectiveMatrix: transformations.perspectiveMatrix,

            aspectRatio: () =>
              selected.length > 1
                ? true
                : app.useKeyboardStore.getState().keyboard.ShiftLeft,
            fromCenter: () => app.useKeyboardStore.getState().keyboard.AltLeft,
          },
          onChange
        );
      } else if (ray.mode === "rotate") {
        app.stores.useTransformStore.getState().setTransform(true, "rotate");
        transformer.current = rotate(
          ray.handle,
          {
            start: mouse.mouse,
            width: transformations.width,
            height: transformations.height,
            matrix: transformations.relativeMatrix,
            affineMatrix: transformations.affineMatrix,
            x: transformations.x,
            y: transformations.y,
            offset: [0, 0],
            snap: () => app.useKeyboardStore.getState().keyboard.ShiftLeft,
            snapDegree: 15,
          },
          onChange
        );
      }
    }

    if (
      mouse.isDown &&
      transformer.current &&
      mouse.mouse !== prev.mouse.mouse
    ) {
      transformer.current({
        clientX: mouse.mouse[0],
        clientY: mouse.mouse[1],
      });
    }
  }, [app.useElementsStore, app.useKeyboardStore, mouse, prev, ray]);

  if (!selectionTransformations) {
    return null;
  }

  return (
    <FreeTransformElement
      transformations={selectionTransformations}
      offset={offset}
    />
  );
}
