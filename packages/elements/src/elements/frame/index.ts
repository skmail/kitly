import { Extension } from "@kitly/system";
import { onSelectionFilter } from "./modifiers/on-selection-filter";
import { frame as frameElement } from "./elements/frame";
import * as raycast from "./raycast";
export const frame: Extension = {
  elements: [frameElement],
  modifiers: {
    elements: {
      onSelectionFilter,
    },
  },
  raycast,
};

export * from "./utils";
