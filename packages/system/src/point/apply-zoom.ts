import { Point } from "@free-transform/core";
import { Vec } from "../vec";

export const applyZoomToPoints = (points: Point[], zoom = 1): Point[] => {
  return points.map((point) => Vec.multiplyScalar(point, zoom));
};