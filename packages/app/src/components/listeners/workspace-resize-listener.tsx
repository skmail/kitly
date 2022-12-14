import { useEffect } from "react";
import { useApp } from "../../app-provider";

export function WorkspaceResizeListener() {
  const app = useApp();

  useEffect(() => {
    const root = app.dom.workspace;

    if (!root) {
      return;
    }
    const onResize = () => {
      if (!root) {
        return;
      }

      const parentBounds = root.getBoundingClientRect();

      const state = app.useWorkspaceStore.getState();

      state.setOffset([parentBounds.x, parentBounds.y]);
      state.setSize([parentBounds.width, parentBounds.height]);
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [app.dom.workspace, app.useWorkspaceStore]);

  return null;
}
