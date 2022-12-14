import { Point } from "@free-transform/core";

export const applyZoomToPoints = (
  points: Point[],
  zoom = 1,
  pan: Point = [0, 0]
): Point[] => {
  return points.map((point) => [
    point[0] * zoom + pan[0],
    point[1] * zoom + pan[1],
  ]);
};
