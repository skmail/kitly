import { App, Point, satCollision } from "@kitly/system";
import { raycastTransformHandle } from "./raycast-transform-handle";

export function raycast(app: App) {
  const selectionTransformations =
    app.useElementsStore.getState().selectionTransformations;

  const mouse = app.useMouseStore.getState().mouse;

  if (selectionTransformations) {
    const zoom = app.useWorkspaceStore.getState().zoom;
    const handle =
      selectionTransformations &&
      raycastTransformHandle(mouse, selectionTransformations, zoom);

    if (handle) {
      return handle;
    }
  }
  
  const results = app.useElementsStore.getState().spatialTree.search({
    minX: mouse[0],
    minY: mouse[1],
    maxX: mouse[0] + 15,
    maxY: mouse[1] + 15,
  });

  const transformations = app.useElementsStore.getState().transformations;

  for (let i = results.length - 1; i >= 0; i--) {
    const result = results[i];

    const id = result.id;
    const transformation = transformations[id];

    if (satCollision([mouse], transformation.points)) {
      return {
        type: "element",
        id: result.id,
      };
    }
  }
}
