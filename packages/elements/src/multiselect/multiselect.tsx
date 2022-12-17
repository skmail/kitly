import { App, shallowEqual, MouseButton, Point } from "@kitly/system";
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
    itemsBounds?: Bounds[];
  }>({});

  const app = useApp<App<[ExtensionDefinition]>>();
  const zoom = app.useWorkspaceStore((state) => state.zoom);
  const mouse = app.useMouseStore<Point>((state) => state.mouse, shallowEqual);
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

    const position: Point = [startPoint.current[0], startPoint.current[1]];

    if (width < 0) {
      width = Math.max(Math.abs(width), 0);
      position[0] = position[0] - width;
    }

    selections.current = [];

    if (height < 0) {
      height = Math.max(Math.abs(height), 0);
      position[1] = position[1] - height;
    }

    const results = app.useElementsStore.getState().spatialTree.search({
      minX: position[0],
      minY: position[1],
      maxX: position[0] + width,
      maxY: position[1] + height,
    });

    const transformations = app.useElementsStore.getState().transformations;
    const selectedBounds: Point[] = [];
    const itemsBounds: Bounds[] = [];

    for (let result of results) {
      const transformation = transformations[result.id];
      const points: Point[] = [
        [transformation.bounds.xmin, transformation.bounds.ymin],
        [transformation.bounds.xmax, transformation.bounds.ymax],
      ];

      itemsBounds.push({
        position: [transformation.bounds.xmin, transformation.bounds.ymin],
        size: [
          transformation.bounds.xmax - transformation.bounds.xmin,
          transformation.bounds.ymax - transformation.bounds.ymin,
        ],
      });
      selectedBounds.push(...points);
      selections.current.push(result.id);
    }

    setState({
      box: {
        position,
        size: [width, height],
      },
      itemsBounds,
    });
  }, [app.stores.useTransformStore, app.useElementsStore, button, mouse]);

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
      {!!state.itemsBounds &&
        state.itemsBounds.map((bounds) => (
          <div
            className="absolute left-0 top-0 border border-orange-500 bg-orange-500 bg-opacity-10"
            style={{
              width: bounds.size[0] * zoom,
              height: bounds.size[1] * zoom,
              left: bounds.position[0] * zoom,
              top: bounds.position[1] * zoom,
            }}
          />
        ))}
      <div
        className="absolute left-0 top-0 border border-blue-500 bg-blue-500 bg-opacity-10"
        style={{
          width: state.box.size[0] * zoom,
          height: state.box.size[1] * zoom,
          left: state.box.position[0] * zoom,
          top: state.box.position[1] * zoom,
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
