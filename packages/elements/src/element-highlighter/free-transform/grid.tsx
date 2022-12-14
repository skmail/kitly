import { minMax, applyToPoints, applyToPoint } from "@free-transform/core";
import { useMemo } from "react";
import { useFreeTransform } from ".";
export interface Props {
  strokeWidth?: number;
  lines?: number;
  fill?: string;
  stroke?: string;
}

export function Grid({
  strokeWidth = 1,
  lines = 2,
  fill = "none",
  stroke = "#000",
}: Props) {
  const { transformations, pan, zoom } = useFreeTransform();

  const svg = useMemo(() => {
    const { absoluteMatrix: matrix, width, height } = transformations;
    const points = applyToPoints(matrix, [
      [0, 0],
      [0, height],
      [width, height],
      [width, 0],
    ]);

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
    const count = Math.max(0, lines) + 1;
    const h = height / count;
    for (let i = h; i < height; i += h) {
      const p = applyToPoint(matrix, [0, i]);
      const p2 = applyToPoint(matrix, [width, i]);
      data.push(`M ${p[0]} ${p[1]}`);
      data.push(`L ${p2[0]} ${p2[1]}`);
    }
    const w = width / count;
    for (let i = w; i < width; i += w) {
      const p = applyToPoint(matrix, [i, 0]);
      const p2 = applyToPoint(matrix, [i, height]);
      data.push(`M ${p[0]} ${p[1]}`);
      data.push(`L ${p2[0]} ${p2[1]}`);
    }
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
  }, [lines, strokeWidth, transformations]);

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
      <path strokeWidth={strokeWidth} d={svg.d} />
    </svg>
  );
}
