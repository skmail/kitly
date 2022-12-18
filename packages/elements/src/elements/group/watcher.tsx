import { useApp } from "@kitly/app";
import { shallowEqual } from "@kitly/system";
import { useEffect } from "react";

export function Watcher() {
  const app = useApp();

  useEffect(() => { 
    return app.useElementsStore.subscribe(
      (state) =>
        state.selectionTransformations.transformations && {
          relative:
            state.selectionTransformations.transformations.relativeMatrix,
          x: state.selectionTransformations.transformations.x,
          y: state.selectionTransformations.transformations.y,
          id: state.selectionTransformations.transformations.id,
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

        // console.log("update", transformations)
        // app.useElementsStore.getState().update(element.children, {
        //   matrix: transformations.relative,
        // });
      },
      {
        equalityFn: shallowEqual,
      }
    );
  }, []);
  return null;
}
