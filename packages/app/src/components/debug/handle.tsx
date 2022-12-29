import { minMax, Point, shallowEqual } from "@kitly/system";
import { useApp } from "../../app-provider";

import { getShapePoints, handles } from "@kitly/system";
import { Box } from "@kitly/elements/src/element-highlighter/free-transform/box";

export function HandleDebug() {
  const app = useApp();

  const zoom = app.useWorkspaceStore((state) => state.zoom);
  const data = app.useElementsStore((state) => {
    if (!state.selected) {
      return;
    }

    const transformations = state.selectionTransformations;

    const result: Point[][] = [];
    const all: Point[] = [];

    if (!transformations) {
      return;
    }

    return handles.map((handle) =>
      getShapePoints({
        handle,
        transformations,
        zoom,
      })
    );
  }, shallowEqual);

  if (!data) {
    return null;
  }

  return (
    <>
      {data.map((points) => (
        <Box points={points} strokeDasharray="1" stroke="#fef08a" />
      ))}
    </>
  );
}
