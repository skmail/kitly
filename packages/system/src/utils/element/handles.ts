import { Point } from "@free-transform/core";
import { HandleProps } from "../../types";

const getHandle = (
  type: HandleProps["type"],
  point: Point,
  offset = 0,
  size = 12
): HandleProps => {
  return {
    type,
    size,
    point: point,
    offset: [
      (offset * (point[0] - 0.5)) / 0.5,
      (offset * (point[1] - 0.5)) / 0.5,
    ],
  };
};

export const handles = (
  [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
    [0.5, 0],
    [1, 0.5],
    [0, 0.5],
    [0.5, 1],
  ] as Point[]
).reduce<HandleProps[]>((acc, position) => {
  acc.push(getHandle("scale", position));
  acc.push(getHandle("rotate", position, 14, 20));
  return acc;
}, []);

export const scaleHandles = handles.filter(
  (handle) =>
    handle.type === "scale" && handle.point[0] != 0.5 && handle.point[1] != 0.5
);
