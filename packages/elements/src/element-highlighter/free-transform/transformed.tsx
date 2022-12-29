import { Matrix, Point, transpose, Tuple } from "@free-transform/core";
import { ComponentProps, PropsWithChildren, useMemo } from "react";
import { useValues } from "./hooks/useValues";

interface Props {
  disabledScale: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  matrix: Matrix;
  warp: Tuple<Point, 4> | undefined;
}
export function Transformed({
  x,
  y,
  width,
  height,
  matrix,
  warp,
  disabledScale,
  style: styles = {},
  ...props
}: PropsWithChildren<Props & ComponentProps<"div">>) {
  const values = useValues({
    x,
    y,
    width,
    height,
    matrix,
    warp,
    disabledScale,
  });
 
  const matrix3d = useMemo(
    () => transpose(values.translatedMatrix),
    [values.translatedMatrix]
  );
  

  return (
    <div
      {...props}
      style={{
        ...styles,
        transform: `matrix3d(${matrix3d})`,
        position: "absolute",
        transformOrigin: "0px 0px",
        width: values.width,
        height: values.height,
        left: 0,
        top: 0,
      }}
    />
  );
}

Transformed.defaultProps = {
  disabledScale: false,
};
