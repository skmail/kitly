import { App, getElementIntersectedWithPoint } from "@kitly/system";
import { raycastTransformHandle } from "./raycast-transform-handle";

export function raycast(app: App) {
  const transformations =
    app.useElementsStore.getState().selectionTransformations.transformations;

  const mouse = app.useMouseStore.getState().mouse;

  if (transformations) {
    const zoom = app.useWorkspaceStore.getState().zoom;
    const handle =
      transformations && raycastTransformHandle(mouse, transformations, zoom);

    if (handle) {
      return handle;
    }
  }

  const elementRay = getElementIntersectedWithPoint(
    mouse,
    {
      ids: app.useElementsStore.getState().ids,
      elements: app.useElementsStore.getState().elements,
    },
    app.useElementsStore.getState().transformations
  );

  if (elementRay) {
    return {
      type: "element",
      id: elementRay,
    };
  }
}
