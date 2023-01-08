import { useEffect } from "react";
import { MouseButtonType } from "@kitly/system";
import { useApp } from "../../app-provider";

export function MouseListener() {
  const app = useApp();

  useEffect(() => {
    const element = app.dom.workspace;

    if (!element) {
      return;
    }

    const mouseState = app.useMouseStore.getState();

    const normalize = (e: MouseEvent) => {
      const { offset, zoom, pan } = app.useWorkspaceStore.getState();
      return [
        (e.clientX - offset[0] - pan[0]) / zoom,
        (e.clientY - offset[1] - pan[1]) / zoom,
      ];
    };
    const onDown = (e: MouseEvent) => {
      e.preventDefault();
      element?.focus();

      const mouse = normalize(e);

      mouseState.setMouse(mouse[0], mouse[1]);
      mouseState.setMouseDown(true);
      mouseState.setInsideWorkspace(element.contains(e.target as HTMLElement));
      mouseState.setButton(e.buttons as MouseButtonType);
    };

    const onUp = (e: MouseEvent) => {
      e.preventDefault();
      mouseState.setMouseDown(false);
      const mouse = normalize(e);
      mouseState.setMouse(mouse[0], mouse[1]);
      mouseState.setInsideWorkspace(element.contains(e.target as HTMLElement));
    };

    let lastMove = [-Infinity, -Infinity];
    const onMove = (e: MouseEvent) => {
      const m = [Math.round(e.clientX), Math.round(e.clientY)];
      if (m[0] === lastMove[0] && m[1] === lastMove[1]) {
        return;
      }
      lastMove = m;

      const mouse = normalize(e);
      mouseState.setMouse(mouse[0], mouse[1]);
      mouseState.setInsideWorkspace(element.contains(e.target as HTMLElement));
    };

    const onLeave = (e: MouseEvent) => {
      lastMove = [-Infinity, -Infinity];
      e.preventDefault();
      mouseState.setInsideWorkspace(false);
    };

    let doubleClickTimeout: number;
    const onDoubleClick = () => {
      clearTimeout(doubleClickTimeout);
      mouseState.setDoubleClick(true);
      doubleClickTimeout = window.setTimeout(() => {
        mouseState.setDoubleClick(false);
      }, 50);
    };

    let clickTimeout: number;
    const onClick = () => {
      clearTimeout(clickTimeout);
      mouseState.setClick(true);
      clickTimeout = window.setTimeout(() => {
        mouseState.setClick(false);
      }, 50);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("drag", onMove);
    element.addEventListener("pointerdown", onDown);
    element.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("dblclick", onDoubleClick);
    window.addEventListener("click", onClick);

    return () => {
      element.removeEventListener("drag", onMove);
      window.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      element.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("dblclick", onDoubleClick);
      window.removeEventListener("click", onClick);
    };
  }, [app.dom.workspace, app.useMouseStore, app.useWorkspaceStore]);
  return null;
}
