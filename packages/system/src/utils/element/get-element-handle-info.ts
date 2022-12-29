import {
  applyToPoint,
  getAngle,
  Point,
  toDegree,
  toRadians,
  wrapAngle,
} from "@free-transform/core";
import { ElementTransformationDetails } from "../../types";

interface Props {
  handle: [number, number];
  transformations: ElementTransformationDetails;
}

export function getDirection(angle: number) {
  var directions = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];
  var index = Math.floor(((angle + 22.5) % 360) / 45);
  return directions[index];
}

export function getElementHandleInfo({ handle, transformations }: Props) {
  const boxSize = 100;
  const point = applyToPoint(transformations.rotationMatrix, [
    handle[0] * boxSize,
    handle[1] * boxSize,
  ]);

  const center = applyToPoint(transformations.rotationMatrix, [
    0.5 * boxSize,
    0.5 * boxSize,
  ]);

  const directionAngle = getAngle(point, center);

  return {
    directionAngle: -directionAngle,
  };
}
