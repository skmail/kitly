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

    for (let raycaster of app.extensions.raycasters.raycasters) {
      let result = raycaster(app);
      if (result !== undefined) {
        ray = result;
        break;
      }
    }

    if (ray) {
      for (let post of app.extensions.raycasters.post) {
        if (post(ray, app) === false) {
          return;
        }
      }
    }

    app.useRaycastStore.getState().setRay(ray);
  }, [app, mouse, isDown]);

  return null;
}
