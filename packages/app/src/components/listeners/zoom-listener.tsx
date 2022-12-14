import { useEffect, useRef } from "react";
import shallow from "zustand/shallow";
import { useApp } from "../../app-provider";

export default function useZoom() {
  const app = useApp();

  const [zoom, setZoom, pan, setPan, animateZoom, setAnimateZoom] =
    app.useWorkspaceStore(
      (state) => [
        state.zoom,
        state.setZoom,
        state.pan,
        state.setPan,
        state.animateZoom,
        state.setAnimateZoom,
      ],
      shallow
    );

  useEffect(() => {
    if (!animateZoom) {
      return;
    }
    const timer = setTimeout(() => {
      setAnimateZoom(false);
    }, 600);

    return () => {
      clearTimeout(timer);
    };
  }, [animateZoom, setAnimateZoom]);

  const panRef = useRef(pan);
  panRef.current = pan;

  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  useEffect(() => {
    const element = app.dom.workspace;
    if (!element) {
      return;
    }

    const onWheel = (e: WheelEvent) => {
      //   if (!e.ctrlKey || useWorkspaceStore.getState().contextMenu.active) {
      //     return;
      //   }

      e.preventDefault();
      e.stopPropagation();

      if (!element) {
        return;
      }

      if (!e.ctrlKey) {
        const SENSITIVITY = 0.4;
        setPan([
          -e.deltaX * SENSITIVITY + panRef.current[0],
          -e.deltaY * SENSITIVITY + panRef.current[1],
        ]);
        return;
      }

      const ZOOM_SENSITIVITY = 200;
      const zoomAmount = -(e.deltaY / ZOOM_SENSITIVITY);

      const zoom = Math.min(
        700,
        Math.max(zoomRef.current + zoomRef.current * zoomAmount, 0.001)
      );

      const box = element.getBoundingClientRect();

      const [clientX, clientY] = [e.clientX - box.x, e.clientY - box.y];

      const xs = (clientX - panRef.current[0]) / zoomRef.current;
      const ys = (clientY - panRef.current[1]) / zoomRef.current;

      const xoff = clientX - xs * zoom;
      const yoff = clientY - ys * zoom;

      setZoom(zoom, [xoff, yoff]);
    };

    element.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      element.removeEventListener("wheel", onWheel);
    };
  }, [app.dom.workspace, setPan, setZoom]);
}

export function ZoomListener() {
  useZoom();
  return null;
}
