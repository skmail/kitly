import { Point } from "@free-transform/core";
import { Vec } from "../vec";

export function applyOffsetToPoint(point: Point, offset: Point): Point {
  return [point[0] + offset[0], point[1] + offset[1]];
}

export function applyOffsetToPoints(points: Point[], offset: Point): Point[] {
  return points.map((point) => Vec.add(point, offset));
}
