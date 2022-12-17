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

    let ray: Raycastable | undefined = undefined;
    let stack: Raycastable[] = [];
    for (let raycaster of app.extensions.raycasters.raycasters) {
      let result = raycaster(app);
      if (result !== undefined) {
        if (!ray) {
          ray = result;
        }
        stack.push(result);
      }
    }

    if (ray) {
      for (let post of app.extensions.raycasters.post) {
        const result = post(
          {
            ray,
            stack,
          },
          app
        );
        if (result === false) {
          ray = undefined;
          stack = [];
          break;
        } else if (result && typeof result === "object") {
          ray = result;
          stack = [result];
          break;
        }
      }
    }

    app.useRaycastStore.getState().setRay(ray, stack);
  }, [app, mouse, isDown]);

  return null;
}
