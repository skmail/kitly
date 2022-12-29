import { minMax, applyToPoints, applyToPoint } from "@free-transform/core";
import { applyZoomToPoints } from "@kitly/system/src/utils/point/apply-zoom";
import { useEffect, useMemo } from "react";
import { useFreeTransform } from ".";
import { Box } from "./box";
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

  const { transformations, zoom } = useFreeTransform();

  // const svg = useMemo(() => {
  //   const {
  //     absoluteMatrix: matrix,
  //     points: pps,
  //     width,
  //     height,
  //   } = transformations;
  //   const points = applyZoomToPoints(pps, zoom);
  //   const data = points.map((point, i) => {
  //     const data = [];
  //     if (i === 0) {
  //       data.push(`M ${point[0].toFixed(10)} ${point[1].toFixed(10)}`);
  //     } else {
  //       data.push(`L ${point[0].toFixed(10)} ${point[1].toFixed(10)}`);
  //     }
  //     return data.join(" ");
  //   });
  //   data.push("Z");
  //   const count = Math.max(0, lines) + 1;
  //   const h = height / count;
  //   for (let i = h; i < height; i += h) {
  //     const p = applyToPoint(matrix, [0, i]);
  //     const p2 = applyToPoint(matrix, [width, i]);
  //     data.push(`M ${p[0]} ${p[1]}`);
  //     data.push(`L ${p2[0]} ${p2[1]}`);
  //   }
  //   const w = width / count;
  //   for (let i = w; i < width; i += w) {
  //     const p = applyToPoint(matrix, [i, 0]);
  //     const p2 = applyToPoint(matrix, [i, height]);
  //     data.push(`M ${p[0]} ${p[1]}`);
  //     data.push(`L ${p2[0]} ${p2[1]}`);
  //   }
  //   const box = minMax(points);
  //   const margin = strokeWidth / 2;
  //   return {
  //     d: data.join(" "),
  //     viewBox: `${(box.xmin - margin).toFixed(10)} ${(
  //       box.ymin - margin
  //     ).toFixed(10)} ${(box.width + margin * 2).toFixed(10)} ${(
  //       box.height +
  //       margin * 2
  //     ).toFixed(10)}`,
  //     width: box.width + margin * 2,
  //     height: box.height + margin * 2,
  //     box: {
  //       ...box,
  //       ymin: box.ymin,
  //       xmin: box.xmin,
  //     },
  //   };
  // }, [lines, strokeWidth, transformations, zoom]);

  // if (!svg) {
  //   return null;
  // }

  const points = useMemo(
    () => applyZoomToPoints(transformations.points, zoom),
    [transformations.points, zoom]
  );

  return <Box strokeWidth={strokeWidth} points={points} fill={fill} stroke={stroke} />;
}
