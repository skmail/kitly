import {
  shallowEqual,
  MouseButton,
  Element,
  Vec,
  rotate,
  scale,
  translate,
  Point,
  Mat,
} from "@kitly/system";
import { useEffect, useRef } from "react";
import { useApp } from "../../../app/src/app-provider";
import { usePrevious } from "../../../app/src/hooks/usePrevious";
import { HandleRaycastResult, RaycastResult } from "../types";

import { FreeTransformElement } from "./free-transform-element";
import { ElementHighlighterExtension } from "./types";

export function SelectionTransform() {
  const app = useApp<[ElementHighlighterExtension]>();

  const selectionTransformations = app.useElementsStore(
    (state) => state.selectionTransformations,
    shallowEqual
  );

  const offset = app.useWorkspaceStore((state) => state.offset, shallowEqual);

  const ray = app.useRaycastStore(
    (state) => state.rays[0] as RaycastResult,
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

  const keyboard = app.useKeyboardStore(
    (state) => ({
      AltLeft: state.keyboard.AltLeft,
      ShiftLeft: state.keyboard.ShiftLeft,
      Space: state.keyboard.Space,
      Meta: state.keyboard.Meta,
    }),
    shallowEqual
  );

  const transformer = useRef<any>();

  const prev = usePrevious({
    mouse,
    keyboard,
  });

  const transformMode = app.stores.useTransformStore(
    (state) => state.transformMode
  );
  const startPosition = useRef<Point | undefined>(undefined);
  useEffect(() => {
    if (mouse.button !== MouseButton.LEFT || !ray || !mouse.isDown) {
      transformer.current = undefined;
      startPosition.current = undefined;
      if (app.stores.useTransformStore.getState().isTransforming) {
        app.stores.useTransformStore.getState().setTransform(false);
        app.elements?.onTransformEnd?.(
          app.useElementsStore.getState().selected
        );
      }
      return;
    }

    if (!startPosition.current) {
      startPosition.current = mouse.mouse;
    }

    if (!app.selection.isEnabled()) {
      return;
    }

    const onChange = (changes: Partial<Element>) => {
      app.selection.update(changes);
    };

    const zoom = app.useWorkspaceStore.getState().zoom;

    if (
      !transformer.current &&
      !Vec.isGreater(
        Vec.multiplyScalar(
          Vec.abs(Vec.subtract(mouse.mouse, startPosition.current)),
          zoom
        ),
        [1, 1]
      )
    ) {
      return;
    }

    const needToStartTransformation =
      mouse.isDown &&
      (!transformer.current ||
        ((prev?.keyboard?.AltLeft !== keyboard.AltLeft ||
          prev?.keyboard?.ShiftLeft !== keyboard.ShiftLeft) &&
          keyboard.Space));

    if (needToStartTransformation) {
      const transformations =
        app.useElementsStore.getState().selectionTransformations;

      if (!transformations) {
        return;
      }

      if (app.selection.isTranslate(ray)) {
        app.stores.useTransformStore.getState().setTransform(true, "translate");
        transformer.current = translate(
          {
            start: mouse.mouse,
            x: transformations.x,
            y: transformations.y,
          },
          onChange
        );
      } else if ((ray as HandleRaycastResult).mode === "scale") {
        app.stores.useTransformStore.getState().setTransform(true, "scale");
        transformer.current = scale(
          (ray as HandleRaycastResult).handle,
          {
            start: mouse.mouse,
            width: transformations.width,
            height: transformations.height,
            matrix: transformations.affineMatrix,
            perspectiveMatrix: Mat.identity(),
            aspectRatio: () =>
              app.useKeyboardStore.getState().keyboard.ShiftLeft ||
              app.transform.aspectRatio(),
            fromCenter: () => app.useKeyboardStore.getState().keyboard.AltLeft,
          },
          onChange
        );
      } else if ((ray as HandleRaycastResult).mode === "rotate") {
        app.stores.useTransformStore.getState().setTransform(true, "rotate");
        transformer.current = rotate(
          keyboard.AltLeft ? [0.5, 0.5] : (ray as HandleRaycastResult).handle,
          {
            start: mouse.mouse,
            width: transformations.width,
            height: transformations.height,
            matrix: transformations.relativeMatrix,
            affineMatrix: transformations.affineMatrix,
            x: transformations.worldPosition[0],
            y: transformations.worldPosition[1],
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
      prev.mouse &&
      !Vec.isEqual(
        Vec.round(Vec.multiplyScalar(mouse.mouse, zoom)),
        Vec.round(Vec.multiplyScalar(prev.mouse.mouse, zoom), 1)
      )
    ) {
      transformer.current({
        clientX: mouse.mouse[0],
        clientY: mouse.mouse[1],
      });
    }
  }, [
    app,
    app.stores.useTransformStore,
    app.useElementsStore,
    app.useKeyboardStore,
    keyboard.AltLeft,
    keyboard.ShiftLeft,
    keyboard.Space,
    mouse.button,
    mouse.isDown,
    mouse.mouse,
    prev?.keyboard?.AltLeft,
    prev?.keyboard?.ShiftLeft,
    prev?.mouse,
    prev?.mouse.mouse,
    ray,
  ]);

  if (!selectionTransformations) {
    return null;
  }

  return (
    <FreeTransformElement
      transformations={selectionTransformations}
      offset={offset}
      className={
        keyboard.Space || transformMode === "translate"
          ? "opacity-0"
          : " transform-opacity "
      }
    />
  );
}
