import {
  makeWarpPoints,
  Matrix,
  Point,
  Tuple,
  makePerspectiveMatrix,
  Mat,
} from "@free-transform/core";

import { useMemo } from "react";

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  matrix: Matrix;
  warp?: Tuple<Point, 4> | undefined;
  disabledScale?: boolean | undefined;
  zoom?: number;
  pan?: [number, number];
};

export function useValues(props: Props) {
  return useMemo(() => {
    const decomposedAffineMatrix = Mat.decompose(props.matrix);

    const width = props.disabledScale
      ? Math.abs(props.width * decomposedAffineMatrix.scale.sx)
      : props.width;

    const height = props.disabledScale
      ? Math.abs(props.height * decomposedAffineMatrix.scale.sy)
      : props.height;

    let warpPoints: Tuple<Point, 4>;

    if (!props.warp) {
      warpPoints = makeWarpPoints(width, height);
    } else if (props.disabledScale) {
      warpPoints = props.warp.map((point) => [
        point[0] * decomposedAffineMatrix.scale.sx,
        point[1] * decomposedAffineMatrix.scale.sy,
      ]) as Tuple<Point, 4>;
    } else {
      warpPoints = props.warp;
    }

    const perspectiveMatrix = makePerspectiveMatrix(
      makeWarpPoints(width, height),
      warpPoints
    );

    let mat = props.matrix;

    if (props.disabledScale) {
      const inverted = Mat.inverse(mat);

      const decomposedInverted = Mat.decompose(inverted);

      mat = Mat.multiply(
        mat,
        Mat.scale(
          decomposedInverted.scale.sx *
            Math.sign(decomposedAffineMatrix.scale.sx),
          decomposedInverted.scale.sy *
            Math.sign(decomposedAffineMatrix.scale.sy)
        )
      );
    }

    let finalMatrix: Matrix = Mat.multiply(
      Mat.scale(props.zoom || 1, props.zoom || 1),
      mat,
      perspectiveMatrix
    );

    const translatedMatrix = Mat.multiply(
      Mat.translate(
        props.x * (props.zoom || 1) + (props.pan?.[0] || 0),
        props.y * (props.zoom || 1) + (props.pan?.[1] || 0)
      ),
      finalMatrix
    );

    return {
      width,
      height,
      warpPoints,
      affineMatrix: props.matrix,
      perspectiveMatrix,
      matrix: finalMatrix,
      translatedMatrix,
    };
  }, [props]);
}
