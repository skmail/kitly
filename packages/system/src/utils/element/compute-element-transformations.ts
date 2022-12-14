import {
  decompose,
  makeWarpPoints,
  Matrix,
  Point,
  Tuple,
  makePerspectiveMatrix,
  inverseAffine,
  multiply,
  matrixScale,
  matrixTranslate,
  applyToPoints,
  minMax,
  toDegree,
  wrapAngle,
} from "@free-transform/core";

import { Element, ElementTransformationDetails, Table } from "../../types";

export function computeElementTransformations(
  element: Element
): ElementTransformationDetails {
  const decomposedAffineMatrix = decompose(element.matrix);

  const width = element.disabledScale
    ? Math.abs(element.width * decomposedAffineMatrix.scale.sx)
    : element.width;

  const height = element.disabledScale
    ? Math.abs(element.height * decomposedAffineMatrix.scale.sy)
    : element.height;

  let warpPoints: Tuple<Point, 4>;

  if (!element.warp) {
    warpPoints = makeWarpPoints(width, height);
  } else if (element.disabledScale) {
    warpPoints = element.warp.map((point) => [
      point[0] * decomposedAffineMatrix.scale.sx,
      point[1] * decomposedAffineMatrix.scale.sy,
    ]) as Tuple<Point, 4>;
  } else {
    warpPoints = element.warp;
  }

  const perspectiveMatrix = makePerspectiveMatrix(
    makeWarpPoints(width, height),
    warpPoints
  );

  let mat = element.matrix;

  const inverted = inverseAffine(mat);
  const decomposedInverted = decompose(inverted);

  const invertedAffineMatrix = multiply(
    mat,
    matrixScale(
      decomposedInverted.scale.sx * Math.sign(decomposedAffineMatrix.scale.sx),
      decomposedInverted.scale.sy * Math.sign(decomposedAffineMatrix.scale.sy)
    )
  );

  if (element.disabledScale) {
    mat = invertedAffineMatrix;
  }

  let relativeMatrix: Matrix = multiply(mat, perspectiveMatrix);

  const absoluteMatrix = multiply(
    matrixTranslate(element.x, element.y),
    relativeMatrix
  );

  const bounds = minMax(
    applyToPoints(absoluteMatrix, [
      [0, 0],
      [width, 0],
      [0, height],
      [width, height],
    ])
  );

  return {
    id: element.id,
    x: element.x,
    y: element.y,
    baseWidth: element.width,
    baseHeight: element.height,

    width,
    height,
    warp: warpPoints,
    affineMatrix: element.matrix,
    invertedAffineMatrix,
    perspectiveMatrix,
    relativeMatrix: relativeMatrix,
    absoluteMatrix,
    scale: decomposedAffineMatrix.scale,
    rotation: {
      ...decomposedAffineMatrix.rotation,
      wraped: wrapAngle(decomposedAffineMatrix.rotation.angle),
      degree: toDegree(decomposedAffineMatrix.rotation.angle),
    },
    translation: { tx: element.matrix[0][3], ty: element.matrix[1][3] },
    disabledScale: element.disabledScale,
    bounds,
  };
}

export function computeElementsTableTransformations(table: Table<Element>) {
  let transformations: Record<string, ElementTransformationDetails> = {};

  for (let id of table.ids) {
    transformations[id] = computeElementTransformations(table.items[id]);
  }

  return transformations;
}
