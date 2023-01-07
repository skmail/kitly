import { GroupElement } from "./types";
import {
  ElementTransformationDetails,
  Matrix,
  OnElementUpdate,
  Point,
} from "@kitly/system";
import { ElementsRenderer } from "@kitly/app";
import { useMemo } from "react";

const toCSSMatrix = (matrix: Matrix) => {
  return `matrix(${[
    matrix[0][0],
    matrix[1][0],
    matrix[0][1],
    matrix[1][1],
    matrix[0][3],
    matrix[1][3],
  ].join(", ")})`;
};

export const Renderer = ({
  element,
  onUpdate,
  offset = [0, 0],
  transformations,
}: {
  element: GroupElement;
  onUpdate?: OnElementUpdate;
  offset?: Point;
  transformations: ElementTransformationDetails;
}) => {
  const transform = useMemo(
    () => toCSSMatrix(transformations.relativeMatrix),
    [transformations.relativeMatrix]
  );

  const clipPathId = `clip-${transformations.id}`;

  return (
    <g transform={`translate(${transformations.x} ${transformations.y})`}>
      <ElementsRenderer ids={element.children} />
    </g>
  );
};
