import { Raycastable, shallowEqual } from "@kitly/system";
import { useEffect } from "react";
import { useApp } from "../../app-provider";

export function RaycastListener() {
  const app = useApp();
  const mouse = app.useMouseStore((state) => state.mouse, shallowEqual);
  const isDown = app.useMouseStore((state) => state.isDown, shallowEqual);

  useEffect(() => {
    for (let validator of app.extensions.raycasters.validators) {
      let result = validator(app);
      if (result === false) {
        return;
      }
    }

    let stack: Raycastable[] = [];
    for (let raycaster of app.extensions.raycasters.raycasters) {
      let result = raycaster(app);
      if (result !== undefined) {
        stack.push(...result);
      }
    }

    for (let post of app.extensions.raycasters.post) {
      const result = post(stack, app);
      if (result !== undefined) {
        stack = result;
      }
    }

    app.useRaycastStore.getState().setRays(stack);
  }, [app, mouse, isDown]);

  return null;
}
