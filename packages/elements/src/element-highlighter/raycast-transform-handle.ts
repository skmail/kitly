import {
  Point,
  isPointInside,
  getShapePoints,
  handles,
  ElementTransformationDetails,
} from "@kitly/system";

import { HandleRaycastResult } from "../types";

export function raycastTransformHandle(
  mouse: Point,
  transformations: ElementTransformationDetails,
  zoom: number = 1
): HandleRaycastResult | void {
  for (let handle of handles) {
    const p = getShapePoints({
      handle: {
        ...handle,
        size: handle.size / zoom,
        offset: [handle.offset[0] / zoom, handle.offset[1] / zoom],
      },
      transformations,
    });

    if (isPointInside(mouse, p)) {
      return {
        type: "handle",
        mode: handle.type,
        handle: [handle.point[0], handle.point[1]],
      };
    }
  }
}
