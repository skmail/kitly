import { Point } from "@free-transform/core";
import { satCollision } from "./sat";

export const CollisionMode = {
  Cover: 0,
  Inside: 1,
  Half: 3,
} as const;

export const Collision = {
  points(points1: Point[], points2: Point[]) {
    return satCollision(points1, points2);
  },
};
