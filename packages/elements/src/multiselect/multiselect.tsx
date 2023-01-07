import { usePrevious } from "@kitly/app/src/hooks/usePrevious";
import {
  App,
  shallowEqual,
  MouseButton,
  Point,
  satCollision,
  Vec,
  applyZoomToPoints,
} from "@kitly/system";
import { throttle } from "lodash-es";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../../../app/src/app-provider";
import { Box } from "../element-highlighter/free-transform/box";
import { ExtensionDefinition } from "../element-highlighter/types";

type Bounds = {
  position: Point;
  size: Point;
};
function InternalMultiselect() {
  const [selectionBoundaries, setSelectionBoundaries] = useState<Bounds | null>(
    null
  );
  const [selectionBoxes, setSelectionBoxes] = useState<Point[][]>([]);

  const app = useApp<App<[ExtensionDefinition]>>();
  const zoom = app.useWorkspaceStore((state) => state.zoom);
  const mouse = app.useMouseStore<Point>((state) => state.mouse, shallowEqual);
  const button = app.useMouseStore((state) => state.button, shallowEqual);

  const startPoint = useRef<Point | undefined>();
  const selections = useRef<string[]>([]);

  const updateSelectionsRef = useRef(
    throttle((selectionBoundaries: Bounds) => {
      const zoom = app.useWorkspaceStore.getState().zoom;

      const results = app.useElementsStore.getState().spatialTree.search({
        minX: selectionBoundaries.position[0],
        minY: selectionBoundaries.position[1],
        maxX: selectionBoundaries.position[0] + selectionBoundaries.size[0],
        maxY: selectionBoundaries.position[1] + selectionBoundaries.size[1],
      });
      const collisionPoints: Point[] = [
        selectionBoundaries.position,
        [
          selectionBoundaries.position[0] + selectionBoundaries.size[0],
          selectionBoundaries.position[1],
        ],
        [
          selectionBoundaries.position[0] + selectionBoundaries.size[0],
          selectionBoundaries.position[1] + selectionBoundaries.size[1],
        ],
        [
          selectionBoundaries.position[0],
          selectionBoundaries.position[1] + selectionBoundaries.size[1],
        ],
      ];
      const transformations = app.useElementsStore.getState().transformations;
      const itemsBounds: Point[][] = [];
      const ids = results.map((result) => result.id);
      const newIds = app.elements.filterSelections(ids);

      selections.current = [];
      for (let id of newIds) {
        const transformation = transformations[id];
        if (!satCollision(collisionPoints, transformation.points)) {
          continue;
        }
        itemsBounds.push(applyZoomToPoints(transformation.points, zoom));
        selections.current.push(id);
      }

      setSelectionBoxes(itemsBounds);
    }, 50)
  );

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

    if (height < 0) {
      height = Math.max(Math.abs(height), 0);
      position[1] = position[1] - height;
    }

    setSelectionBoundaries({
      position,
      size: [width, height],
    });
  }, [app, app.stores.useTransformStore, app.useElementsStore, button, mouse]);

  const prevSelectionBoundaries = usePrevious(selectionBoundaries);
  useEffect(() => {
    if (button !== MouseButton.LEFT) {
      return;
    }
    if (!selectionBoundaries) {
      setSelectionBoxes([]);
      return;
    }

    if (
      prevSelectionBoundaries &&
      Vec.isEqual(
        Vec.round(prevSelectionBoundaries.position, 1),
        Vec.round(selectionBoundaries.position, 1)
      ) &&
      Vec.isEqual(
        Vec.round(prevSelectionBoundaries.size, 1),
        Vec.round(selectionBoundaries.size, 1)
      )
    ) {
      return;
    }

    updateSelectionsRef.current(selectionBoundaries);
  }, [app.useWorkspaceStore, button, selectionBoundaries]);

  useEffect(
    () => () => {
      if (selections.current.length) {
        app.useElementsStore.getState().select(selections.current);
      }
    },
    []
  );

  if (!selectionBoundaries) {
    return null;
  }

  return (
    <>
      {!!selectionBoxes &&
        selectionBoxes.map((points, index) => (
          <Box strokeWidth={1.5} key={index} points={points} />
        ))}
      <div
        className="absolute left-0 top-0 border border-blue-500 bg-blue-500 bg-opacity-10"
        style={{
          width: selectionBoundaries.size[0] * zoom,
          height: selectionBoundaries.size[1] * zoom,
          left: selectionBoundaries.position[0] * zoom,
          top: selectionBoundaries.position[1] * zoom,
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
