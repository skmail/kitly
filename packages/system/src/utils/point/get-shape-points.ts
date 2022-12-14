import { applyToPoints, getPointAtAngle, Point } from "@free-transform/core";
import { ElementTransformationDetails, HandleProps } from "../../types";
import { applyOffsetToPoints } from "./apply-offset";
import { applyZoomToPoints } from "./apply-zoom";

interface Props {
  handle: HandleProps;
  transformations: ElementTransformationDetails;
  zoom?: number;
  pan?: Point;
  signx?: 1 | -1;
  signy?: 1 | -1;
  sx?: number;
  sy?: number;
}

export const getShapePoints = ({
  handle,
  transformations,
  zoom = 1,
}: Props) => {
  const [sx, sy] = [
    transformations?.disabledScale ? 1 : transformations.scale.sx,
    transformations?.disabledScale ? 1 : transformations.scale.sy,
  ];

  const [signx, signy] = [
    Math.sign(transformations.scale.sx),
    Math.sign(transformations.scale.sy),
  ];

  let __x = handle.point[0];
  let __y = handle.point[1];
  let handleWidth = handle.size;
  let handleHeight = handle.size;
  let width = transformations.width;
  let height = transformations.height;

  if (handle.type === "scale") {
    if (__x === 0.5) {
      handleWidth = width * sx * zoom;
    }
    if (__y === 0.5) {
      handleHeight = height * sy * zoom;
    }
  }

  let [x, y] = [__x * width, __y * height];
  let [w, h] = [handleWidth / sx, handleHeight / sy];

  if (transformations.disabledScale) {
    w *= signx;
    h *= signy;
  }

  const offset: [number, number] = [handleWidth / 2, handleHeight / 2];

  const _offset = getPointAtAngle(
    [
      handle.offset[0] * signx - offset[0],
      handle.offset[1] * signy - offset[1],
    ],
    transformations.rotation.wraped
  );

  let points: Point[] = [
    [x, y],
    [x, y + h / zoom],
    [x + w / zoom, y + h / zoom],
    [x + w / zoom, y],
  ];

  let point = applyToPoints(transformations.absoluteMatrix, points);

  return applyOffsetToPoints(applyZoomToPoints(point, zoom), _offset);
};
