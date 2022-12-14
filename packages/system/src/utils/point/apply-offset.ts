import { Point } from "@free-transform/core";

export function applyOffsetToPoint(point: Point, offset: Point): Point {
  return [point[0] + offset[0], point[1] + offset[1]];
}

export function applyOffsetToPoints(points: Point[], offset: Point): Point[] {
  return points.map((point) => applyOffsetToPoint(point, offset));
}
