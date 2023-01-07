import { useApp } from "@kitly/app";
import { shallowEqual } from "@kitly/system";
import { useEffect } from "react";

export function Watcher() {
  const app = useApp();

  useEffect(() => { 
    return app.useElementsStore.subscribe(
      (state) =>
        state.selectionTransformations && {
          relative:
            state.selectionTransformations.affineMatrix,
          x: state.selectionTransformations.x,
          y: state.selectionTransformations.y,
          id: state.selectionTransformations.id,
        },
      function (transformations, prev) {
        if (!transformations) {
          return;
        }
        const element =
          app.useElementsStore.getState().elements[transformations.id];

        if (!element) {
          return;
        }
        if (element.type !== "group" || !element.children) {
          return;
        }
      },
      {
        equalityFn: shallowEqual,
      }
    );
  }, []);
  return null;
}
