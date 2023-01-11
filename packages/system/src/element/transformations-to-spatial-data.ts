import { SpatialElement } from "../types/spatial-tree";
import { ElementTransformationDetails } from "../types";

export function transformationsToSpatialData(
  newTransformations: Record<string, ElementTransformationDetails>,
  oldTransformations: Record<string, ElementTransformationDetails>
): [SpatialElement[], SpatialElement[]];

export function transformationsToSpatialData(
  newTransformations: Record<string, ElementTransformationDetails>,
  oldTransformations?: Record<string, ElementTransformationDetails>
): SpatialElement[];

export function transformationsToSpatialData(
  newTransformations: Record<string, ElementTransformationDetails>,
  oldTransformations?: Record<string, ElementTransformationDetails>
): [SpatialElement[], SpatialElement[]] | SpatialElement[] {
  const results = Object.values(newTransformations).reduce<
    [SpatialElement[], SpatialElement[]]
  >(
    (acc, transformation) => {
      acc[0].push({
        minX: transformation.bounds.xmin,
        minY: transformation.bounds.ymin,
        maxX: transformation.bounds.xmax,
        maxY: transformation.bounds.ymax,
        id: transformation.id,
        type: "element",
      });

      if (!oldTransformations) {
        return acc;
      }

      const old = oldTransformations[transformation.id];

      if (!old) {
        return acc;
      }

      acc[1].push({
        minX: old.bounds.xmin,
        minY: old.bounds.ymin,
        maxX: old.bounds.xmax,
        maxY: old.bounds.ymax,
        id: transformation.id,
        type: "element",
      });
      return acc;
    },
    [[], []]
  );

  if (!oldTransformations) {
    return results[0];
  }
  return results;
}
