import {
  Extension,
  Element,
  ElementTransformationDetails,
  App,
  SpatialElement,
  minMax,
} from "@kitly/system";
import { onSelectionFilter } from "./modifiers/on-selection-filter";
import { frame as frameElement } from "./elements/frame";
import * as raycast from "./raycast";
import { Pannable } from "./ui/pannable";
import { FrameTitleUtils } from "./frame-title-utils";
export const frame: Extension = {
  ui: {
    pannable: Pannable,
  },
  elements: [frameElement],
  modifiers: {
    elements: {
      onSelectionFilter,
      addFromTree: {
        priority: Infinity,
        modifier(
          tree,
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
        },
      },
    },
  },
  raycast,
};

export * from "./utils";
