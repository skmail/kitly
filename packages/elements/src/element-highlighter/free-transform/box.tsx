import { minMax, Point } from "@free-transform/core";
import { memo, useMemo } from "react";
export interface Props {
  strokeWidth?: number;
  lines?: number;
  fill?: string;
  stroke?: string;
  points: Point[];
  strokeDasharray?: string;
}

function _Box({
  strokeWidth = 1,
  fill = "none",
  stroke = "#f97316",
  points,
  strokeDasharray,
}: Props) {
  const svg = useMemo(() => {
    const data = points.map((point, i) => {
      const data = [];
      if (i === 0) {
        data.push(`M ${point[0].toFixed(10)} ${point[1].toFixed(10)}`);
      } else {
        data.push(`L ${point[0].toFixed(10)} ${point[1].toFixed(10)}`);
      }
      return data.join(" ");
    });

    data.push("Z");
    const box = minMax(points);
    const margin = strokeWidth / 2;
    return {
      d: data.join(" "),
      viewBox: `${(box.xmin - margin).toFixed(10)} ${(
        box.ymin - margin
      ).toFixed(10)} ${(box.width + margin * 2).toFixed(10)} ${(
        box.height +
        margin * 2
      ).toFixed(10)}`,
      width: box.width + margin * 2,
      height: box.height + margin * 2,
      box: {
        ...box,
        ymin: box.ymin,
        xmin: box.xmin,
      },
    };
  }, [points, strokeWidth]);

  if (!svg) {
    return null;
  }
  return (
    <svg
      style={{
        position: "absolute",
        transform: `translate(${svg.box.xmin}px, ${svg.box.ymin}px)`,
        left: 0,
        top: 0,
      }}
      width={svg.width}
      height={svg.height}
      viewBox={svg.viewBox}
      fill={fill}
      stroke={stroke}
    >
      <path
        strokeDasharray={strokeDasharray}
        strokeWidth={strokeWidth}
        d={svg.d}
      />
    </svg>
  );
}

export const Box = memo(_Box);
