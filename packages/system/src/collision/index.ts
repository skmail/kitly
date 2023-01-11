import { Point, Tuple } from "@free-transform/core";
import { AABB } from "./aabb";
import { satCollision } from "./sat";

export const CollisionMode = {
  Cover: 0,
  Inside: 1,
} as const;

type CollisionModeKey = typeof CollisionMode[keyof typeof CollisionMode];
export const Collision = {
  points(points1: Point[], points2: Point[]) {
    return satCollision(points1, points2);
  },

  // @box points must be in clockwise direction
  // [top-left, top-right, bottom-right, bottom-left]
  boxToPoints(
    box: Tuple<Point, 4>,
    points: Point[],
    mode: CollisionModeKey = CollisionMode.Cover
  ) {
    if (mode === CollisionMode.Inside) {
      return Collision.points(box, points);
    } else if (mode === CollisionMode.Cover) {
      return AABB.coverBox(box, points);
    }
    return false;
  },
};
