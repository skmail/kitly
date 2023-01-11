import { applyToPoint, Point, wrapAngle } from "@free-transform/core";
import { ElementTransformationDetails } from "../types";
import { Vec } from "../vec";

interface Props {
  handle: [number, number];
  transformations: ElementTransformationDetails;
}

export function getElementHandleInfo({ handle, transformations }: Props) {
  const size: Point = [
    Math.max(transformations.width, transformations.height),
    Math.max(transformations.width, transformations.height),
  ];

  const point = applyToPoint(
    transformations.rotationMatrix,
    Vec.multiply(handle, size)
  );

  const center = applyToPoint(
    transformations.rotationMatrix,
    Vec.multiply([1 - handle[0], 1 - handle[1]], size)
  );

  const directionAngle = wrapAngle(Vec.atan2(center, point));

  return {
    directionAngle: directionAngle,
  };
}
