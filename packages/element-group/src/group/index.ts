import { GroupExtension } from "./types";
import { GroupActivationHandler } from "./group-activation-handler";
import { onTransformEnd } from "./modifiers/on-transform";
import { onSelectionFilter } from "./modifiers/on-selection-filter";
import { useGroupStore } from "./group-store";
import * as raycast from "./raycast";
import { aspectRatio } from "./modifiers/aspect-ratio";
import { group as groupElement } from "./elements/group";

export const group: GroupExtension = {
  ui: {
    static: GroupActivationHandler,
  },
  elements: [groupElement],
  modifiers: {
    transform: {
      aspectRatio,
    },
    elements: {
      onSelectionFilter,
      onTransformEnd,
    },
  },
  raycast,
  stores: {
    useGroupStore: useGroupStore,
  },
};

export * from "./utils";
