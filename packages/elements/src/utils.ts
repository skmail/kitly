import { Raycastable } from "@kitly/system";
import { ElementRaycastResult } from "./types";

export function isElementRay(ray: Raycastable): ray is ElementRaycastResult {
  return ray.type === "element";
}
