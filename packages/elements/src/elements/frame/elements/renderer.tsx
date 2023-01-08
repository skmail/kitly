import { FrameElement } from "../types";
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
  element: FrameElement;
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
    <>
      <defs>
        <clipPath id={clipPathId}>
          <rect
            width={transformations.width}
            height={transformations.height}
            transform={transform}
            
          />
        </clipPath>
      </defs>

      <g
        transform={`translate(${transformations.x} ${transformations.y})`}
        clipPath={`url(#${clipPathId})`}
      >
        <rect
          width={transformations.width}
          height={transformations.height}
          transform={transform}
          fill={element.fill || "white"}
        />
        <ElementsRenderer ids={element.children} />
      </g>
    </>
  );
};
