import { Point } from "@free-transform/core";

type Projection = {
  min: number;
  max: number;
};

function getAxes(points: Point[]) {
  const axes: Point[] = [];
  const length = points.length;
  for (let i = 0; i < length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % length];
    const edge: Point = [p2[0] - p1[0], p2[1] - p1[1]];

    axes.push([edge[1], -edge[0]]);
  }
  return axes;
}

function getProjection(points: Point[], axis: Point): Projection {
  let min = Infinity;
  let max = -Infinity;
  for (let point of points) {
    let projection = point[0] * axis[0] + point[1] * axis[1];
    min = Math.min(min, projection);
    max = Math.max(max, projection);
  }
  return { min, max };
}

export function satCollision(points1: Point[], points2: Point[]): boolean {
  const axes = [...getAxes(points1), ...getAxes(points2)];

  for (let axis of axes) {
    const projection1 = getProjection(points1, axis);
    const projection2 = getProjection(points2, axis);
    if (
      projection1.max < projection2.min ||
      projection2.max < projection1.min
    ) {
      return false;
    }
  }

  return true;
}
