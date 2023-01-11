import {
  App,
  ElementTransformationDetails,
  SpatialElement,
  Element,
  minMax,
} from "@kitly/system";
import { FrameTitleUtils } from "../frame-title-utils";

export function addFromTree(
  tree: any,
  app: App,
  results: {
    elements: Element[];
    transformations: Record<string, ElementTransformationDetails>;
  }
) {
  const spatialElements: SpatialElement[] = [];
  for (let element of results.elements) {
    if (element.parentId || element.type !== "frame") {
      continue;
    }

    const transformations = results.transformations[element.id];

    const bounds = minMax(
      FrameTitleUtils.points(FrameTitleUtils.info(transformations))
    );

    spatialElements.push({
      minX: bounds.xmin,
      minY: bounds.ymin,
      maxX: bounds.xmax,
      maxY: bounds.ymax,
      id: element.id,
      type: "frame-title",
    });
  }

  app.useElementsStore.getState().spatialTree.load(spatialElements);
}
