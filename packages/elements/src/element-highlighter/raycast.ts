import { App } from "@kitly/system";
import { raycastElements } from "./raycast-elements";
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
      return [handle];
    }
  }

  return raycastElements(mouse, app);
}
