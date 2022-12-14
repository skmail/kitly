import { App, shallowEqual } from "@kitly/system";
import { minMax, MouseButton, Point } from "@kitly/system";
import { isPointInside } from "@kitly/system";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../../../app/src/app-provider";
import { ExtensionDefinition } from "../element-highlighter/types";

type Bounds = {
  position: Point;
  size: Point;
};
function InternalMultiselect() {
  const [state, setState] = useState<{
    box?: Bounds;
    selectionBounds?: Bounds;
  }>({});

  const app = useApp<App<[ExtensionDefinition]>>();

  const zoom = app.useWorkspaceStore((state) => state.zoom);

  const mouse = app.useMouseStore<Point>(
    (state) => [state.mouse[0] * zoom, state.mouse[1] * zoom],
    shallowEqual
  );
  const button = app.useMouseStore((state) => state.button, shallowEqual);

  const startPoint = useRef<Point | undefined>();
  const selections = useRef<string[]>([]);

  useEffect(() => {
    if (button !== MouseButton.LEFT) {
      return;
    }

    if (!startPoint.current) {
      startPoint.current = mouse;
    }

    app.stores.useTransformStore.getState().setIsSelecting(true);

    let width = mouse[0] - startPoint.current[0];
    let height = mouse[1] - startPoint.current[1];
    const position: Point = [0, 0];

    position[0] = startPoint.current[0];
    position[1] = startPoint.current[1];

    if (width < 0) {
      width = Math.max(Math.abs(width), 0);
      position[0] = position[0] - width;
    }

    selections.current = [];
    const selectedBounds: Point[] = [];

    if (height < 0) {
      height = Math.max(Math.abs(height), 0);
      position[1] = position[1] - height;
    }

    for (let id of app.useElementsStore.getState().ids) {
      const transformations =
        app.useElementsStore.getState().transformations[id];
      const points: Point[] = [
        [
          transformations.bounds.xmin * zoom,
          transformations.bounds.ymin * zoom,
        ],
        [
          transformations.bounds.xmax * zoom,
          transformations.bounds.ymax * zoom,
        ],
      ];

      if (
        position[0] <= points[0][0] &&
        position[1] <= points[0][1] &&
        position[0] + width >= points[1][0] &&
        position[1] + height >= points[1][1]
      ) {
        selectedBounds.push(...points);
        selections.current.push(id);
      }
    }

    let bounds: Bounds | undefined = undefined;
    if (selectedBounds.length) {
      const b = minMax(selectedBounds);
      bounds = {
        position: [b.xmin, b.ymin],
        size: [b.width, b.height],
      };
    }

    setState({
      box: {
        position,
        size: [width, height],
      },
      selectionBounds: bounds,
    });
  }, [app.stores.useTransformStore, app.useElementsStore, button, mouse, zoom]);

  useEffect(
    () => () => {
      if (selections.current.length) {
        app.useElementsStore.getState().select(selections.current);
      }
    },
    []
  );

  if (!state.box) {
    return null;
  }

  return (
    <>
      {!!state.selectionBounds && (
        <div
          className="absolute left-0 top-0 border border-orange-500 bg-orange-500 bg-opacity-10"
          style={{
            width: state.selectionBounds.size[0],
            height: state.selectionBounds.size[1],
            left: state.selectionBounds.position[0],
            top: state.selectionBounds.position[1],
          }}
        />
      )}
      <div
        className="absolute left-0 top-0 border border-blue-500 bg-blue-500 bg-opacity-10"
        style={{
          width: state.box.size[0],
          height: state.box.size[1],
          left: state.box.position[0],
          top: state.box.position[1],
        }}
      />
    </>
  );
}
export function Multiselect() {
  const app = useApp<App<[ExtensionDefinition]>>();
  const isDown = app.useMouseStore(
    (state) => state.isDown && !app.useRaycastStore.getState().ray
  );

  useEffect(() => {
    if (!isDown) {
      if (app.stores.useTransformStore.getState().isSelecting) {
        app.stores.useTransformStore.getState().setIsSelecting(false);
      }
    }
  }, [app.stores.useTransformStore, isDown]);
  
  if (!isDown) {
    return null;
  }

  return <InternalMultiselect />;
}
