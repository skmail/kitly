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
import { addFromTree } from "./modifiers/add-from-tree";
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
        modifier: addFromTree,
      },
    },
  },
  raycast,
};

export * from "./utils";
