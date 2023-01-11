import { Matrix, minMax, Point, Mat, Angle } from "@free-transform/core";

import { Element, ElementTransformationDetails, Table } from "../types";
import { Vec } from "../vec";
import { applyOffsetToPoints } from "../point/apply-offset";

export function computeElementTransformations(
  element: Element,
  parentTransformations?: ElementTransformationDetails
): ElementTransformationDetails {
  const decomposedAffineMatrix = Mat.decompose(element.matrix);

  const width = element.width;
  const height = element.height;

  const rotationMatrix = Mat.multiply(
    element.matrix,
    Mat.inverse(
      Mat.scale(
        decomposedAffineMatrix.scale.sx *
          Math.sign(decomposedAffineMatrix.scale.sx),
        decomposedAffineMatrix.scale.sy *
          Math.sign(decomposedAffineMatrix.scale.sy)
      )
    )
  );

  // alias of original matrix, will be combined with perspectiveMatrix in the future
  let relativeMatrix: Matrix = element.matrix;

  const absoluteMatrix = Mat.multiply(
    Mat.translate(element.x, element.y),
    relativeMatrix
  );

  const worldPosition: Point = parentTransformations
    ? [
        parentTransformations.worldPosition[0],
        parentTransformations.worldPosition[1],
      ]
    : [0, 0];

  const points = applyOffsetToPoints(
    Mat.toPoints(absoluteMatrix, [
      [0, 0],
      [width, 0],
      [width, height],
      [0, height],
    ]),
    worldPosition
  );

  const bounds = minMax(points);

  return {
    id: element.id,
    x: element.x,
    y: element.y,
    width,
    height,
    affineMatrix: element.matrix,
    rotationMatrix,
    relativeMatrix,
    absoluteMatrix,
    scale: decomposedAffineMatrix.scale,
    rotation: {
      ...decomposedAffineMatrix.rotation,
      wraped: Angle.wrap(decomposedAffineMatrix.rotation.angle),
      degree: Angle.degrees(decomposedAffineMatrix.rotation.angle),
    },
    translation: { tx: element.matrix[0][3], ty: element.matrix[1][3] },
    disabledScale: element.disabledScale,
    bounds,
    points,
    worldPosition: Vec.add(worldPosition, [element.x, element.y]),
  };
}

export function computeElementsTableTransformations(
  table: Table<Element>,
  transformations: Record<string, ElementTransformationDetails> = {},
  computeChildren = true
) {
  let currentTransformations: Record<string, ElementTransformationDetails> = {};

  for (let id of table.ids) {
    currentTransformations = {
      ...currentTransformations,
      [id]: computeElementTransformations(
        table.items[id],
        transformations[table.items[id].parentId || ""]
      ),
    };
    const children = table.items[id].children;
    if (children && computeChildren) {
      currentTransformations = {
        ...currentTransformations,
        ...computeElementsTableTransformations(
          {
            ids: children,
            items: table.items,
          },
          {
            ...transformations,
            ...currentTransformations,
          },
          computeChildren
        ),
      };
    }
  }

  return currentTransformations;
}
