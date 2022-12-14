import { isPointInside } from "../point/is-point-inside";
import { Point } from "@free-transform/core";
import { Element, ElementTransformationDetails } from "../../types";

export const getElementIntersectedWithPoint = (
  mouse: [number, number],
  table: {
    ids: string[];
    elements: Record<string, Element>;
  },
  transformations: Record<string, ElementTransformationDetails>
) => {
  const ids = table.ids;
  for (let i = ids.length - 1; i >= 0; i--) {
    const id = ids[i];
    const transformation = transformations[id];

    const points: Point[] = [
      [transformation.bounds.xmin, transformation.bounds.ymin],
      [transformation.bounds.xmin, transformation.bounds.ymax],
      [transformation.bounds.xmax, transformation.bounds.ymax],
      [transformation.bounds.xmax, transformation.bounds.ymin],
    ];

    if (isPointInside(mouse, points)) {
      return id;
    }
  }
};
