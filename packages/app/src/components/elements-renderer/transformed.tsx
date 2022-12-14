import { Matrix, transpose } from "@free-transform/core";
import { ComponentProps, PropsWithChildren, useMemo } from "react";
import { ElementTransformationDetails } from "@kitly/system";
interface Props {
  transformations: ElementTransformationDetails;
}
export function Transformed({
  transformations,
  style: styles = {},
  ...props
}: PropsWithChildren<Props & ComponentProps<"div">>) {
  const matrix3d = useMemo(
    () => transpose(transformations.absoluteMatrix),
    [transformations.absoluteMatrix]
  );

  return (
    <div
      {...props}
      style={{
        ...styles,
        transform: `matrix3d(${matrix3d})`,
        position: "absolute",
        transformOrigin: "0px 0px",
        width: transformations.width,
        height: transformations.height,
        left: 0,
        top: 0,
      }}
    />
  );
}
