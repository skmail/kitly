import { Point, ElementTransformationDetails, Vec, Mat } from "@kitly/system";

const isMin = (
  point: Point,
  origin: Point,
  currentMin: number,
  callback: (dist: number) => void
) => {
  const dist = Vec.distance(point, origin);
  const isMin = dist < currentMin;
  if (isMin) {
    return callback(dist);
  }
};
export function getTitleInfo(transformations: ElementTransformationDetails) {
  const topLeftOrigin: Point = [
    transformations.bounds.xmin,
    transformations.bounds.ymin,
  ];
  const topRightOrigin: Point = [
    transformations.bounds.xmax,
    transformations.bounds.ymin,
  ];

  const { topLeftIndex, topRightIndex } = transformations.points.reduce(
    (acc, point, index) => {
      isMin(point, topLeftOrigin, acc.topLeft, (dist) => {
        acc.topLeft = dist;
        acc.topLeftIndex = index;
      });
      isMin(point, topRightOrigin, acc.topRight, (dist) => {
        acc.topRight = dist;
        acc.topRightIndex = index;
      });
      return acc;
    },
    {
      topLeft: Number.MAX_VALUE,
      topLeftIndex: 0,
      topRight: Number.MAX_VALUE,
      topRightIndex: 0,
    }
  );

  const topLeft = transformations.points[topLeftIndex];
  const topRight = transformations.points[topRightIndex];

  const angle = Vec.atan2(topLeft, topRight);

  const offset = Mat.toPoint(Mat.rotate(angle), [0, -20]);

  const width = Vec.distance(topRight, topLeft);

  return {
    angle,
    position: topLeft,
    offset,
    width: width !== 0 ? width : transformations.bounds.xmax - topLeft[0],
  };
}
