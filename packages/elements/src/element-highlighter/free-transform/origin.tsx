import { useMemo, PointerEvent as ReactPointerEvent } from "react";
import { useFreeTransform } from ".";
import {
  decompose,
  applyToPoint,
  getPointAtAngle,
  toDegree,
  Point,
} from "@free-transform/core";
import { useDrag } from "./hooks/useDrag";
export function wrapAngle(radians: number) {
  while (radians < -Math.PI) radians += 2 * Math.PI;
  while (radians >= Math.PI) radians -= 2 * Math.PI;
  return radians;
}

interface Props {
  position: [number, number];
  className?: string;
  onChange: (origin: [number, number]) => void;
}

export function Origin({ position, className, onChange }: Props) {
  const { affineMatrix, matrix, width, height, offset } = useFreeTransform();

  const transform = useMemo(() => {
    const decomposed = decompose(affineMatrix);
    const point1 = applyToPoint(matrix, [
      position[0] * width,
      position[1] * height,
    ]);
    const point2 = applyToPoint(matrix, [
      position[0] * width,
      position[1] * height,
    ]);

    const find = (p1: number, p2: number, per: number) => p1 + (p2 - p1) * per;
    const percentage = Math.abs(position[0] - position[1]);
    const point: Point = [
      find(point1[0], point2[0], percentage),
      find(point1[1], point2[1], percentage),
    ];

    const radians = wrapAngle(decomposed.rotation.angle);

    return `translate(${point[0]}px, ${point[1]}px) rotate(${-toDegree(
      radians
    )}deg)`;
  }, [affineMatrix, height, matrix, position, width]);

  const drag = useDrag();
  const onDown = (event: PointerEvent) => {
    const start = [event.pageX - offset[0], event.pageY - offset[1]];
    const point = applyToPoint(matrix, [1 * width, 1 * height]);
    drag((event) => {
      const dragged = [event.pageX - offset[0], event.pageY - offset[1]];

      const origin: [number, number] = [
        dragged[0] / point[0],
        dragged[1] / point[1],
      ];

      onChange(origin);
    });
  };

  return (
    <div
      className={className}
      style={{ transform, transformOrigin: "50% 50%" }}
      onPointerDown={onDown}
    ></div>
  );
}
