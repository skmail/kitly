import {
  useMemo,
  PointerEvent as ReactPointerEvent,
  ComponentProps,
} from "react";
import { useFreeTransform } from ".";
import {
  applyToPoint,
  getPointAtAngle,
  toDegree,
  Point,
} from "@free-transform/core";
import { applyZoomToPoint } from "@kitly/system/src/utils/point/apply-zoom";
import { applyOffsetToPoint } from "@kitly/system/src/utils/point/apply-offset";

interface Props {
  position: [number, number];
  origin?: [number, number];
  type: "warp" | "rotate" | "scale";
  offset?: [number, number];
}

export function Handle({
  position,
  type,
  offset = [0, 0],
  style = {},
  ...rest
}: ComponentProps<"div"> & Props) {
  const { transformations, zoom } = useFreeTransform();

  const transform = useMemo(() => {
    const point1 = applyToPoint(transformations.relativeMatrix, [
      Math.floor(position[0]) * transformations.width,
      Math.floor(position[1]) * transformations.height,
    ]);
    const point2 = applyToPoint(transformations.relativeMatrix, [
      Math.ceil(position[0]) * transformations.width,
      Math.ceil(position[1]) * transformations.height,
    ]);

    const find = (p1: number, p2: number, per: number) => p1 + (p2 - p1) * per;
    const percentage = Math.abs(position[0] - position[1]);
    const point: Point = [
      find(point1[0], point2[0], percentage),
      find(point1[1], point2[1], percentage),
    ];

    const radians = transformations.rotation.wraped;
    const offsetPosition = getPointAtAngle(
      [
        offset[0] * Math.sign(transformations.scale.sx),
        offset[1] * Math.sign(transformations.scale.sy),
      ],
      radians
    );

    const final = applyZoomToPoint(
      applyOffsetToPoint(
        [offsetPosition[0] + point[0], offsetPosition[1] + point[1]],
        transformations.worldPosition
      ),
      zoom
    );
    return `translate(${final[0]}px, ${final[1]}px) rotate(${-toDegree(
      radians
    )}deg)`;
  }, [
    offset,
    position,
    transformations.height,
    transformations.relativeMatrix,
    transformations.rotation.wraped,
    transformations.scale.sx,
    transformations.scale.sy,
    transformations.width,
    transformations.worldPosition,
    zoom,
  ]);

  return (
    <div
      {...rest}
      data-handle={type}
      style={{ transform, transformOrigin: "50% 50%", ...style }}
    ></div>
  );
}
