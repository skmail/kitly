import { ComponentProps, PropsWithChildren, useMemo } from "react";
import { ElementTransformationDetails } from "@kitly/system";
interface Props {
  transformations: ElementTransformationDetails;
  clipContents?: boolean;
}
export function Transformed({
  transformations,
  style: styles = {},
  clipContents = true,
  ...props
}: PropsWithChildren<Props & Omit<ComponentProps<"g">, "offset">>) {
  const matrix3d = useMemo(
    () =>
      [
        transformations.absoluteMatrix[0][0],
        transformations.absoluteMatrix[1][0],
        transformations.absoluteMatrix[0][1],
        transformations.absoluteMatrix[1][1],
        transformations.absoluteMatrix[0][3],
        transformations.absoluteMatrix[1][3],
      ].join(" "),
    [transformations.absoluteMatrix]
  );
  const clipPathId = `clipPath-${transformations.id}`;

  return (
    <>
      {clipContents && (
        <defs>
          <clipPath id={clipPathId}>
            <rect
              width={transformations.width}
              height={transformations.height}
            />
          </clipPath>
        </defs>
      )}
      <g
        {...props}
        style={{
          ...styles,
          fill: "#fff",
          clipPath: clipContents ? `url(#${clipPathId})` : undefined,
        }}
        transform={`matrix(${matrix3d})`}
      />
    </>
  );
}
