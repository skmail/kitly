import { Point, round } from "@free-transform/core";

export const Vec = {
  round(vec: Point, precision?: number): Point {
    return [round(vec[0], precision), round(vec[1], precision)];
  },

  isEqual(vec1: Point, vec2: Point): boolean {
    return vec1[0] === vec2[0] && vec1[1] === vec2[1];
  },

  isGreater(vec: Point, vec1: Point, strict = false) {
    const x = vec[0] > vec1[0];
    const y = vec[1] > vec1[1];
    return strict ? x && y : x || y;
  },

  isLess(vec: Point, vec1: Point, strict = false) {
    const x = vec[0] < vec1[0];
    const y = vec[1] < vec1[1];
    return strict ? x && y : x || y;
  },

  add(vec: Point, vec1: Point): Point {
    return [vec[0] + vec1[0], vec[1] + vec1[1]];
  },

  subtract(vec: Point, vec1: Point): Point {
    return [vec[0] - vec1[0], vec[1] - vec1[1]];
  },

  multiplyScalar(vec: Point, num: number): Point {
    return [vec[0] * num, vec[1] * num];
  },

  divideScalar(vec: Point, num: number): Point {
    return [vec[0] / num, vec[1] / num];
  },

  abs(vec: Point): Point {
    return [Math.abs(vec[0]), Math.abs(vec[1])];
  },
};
