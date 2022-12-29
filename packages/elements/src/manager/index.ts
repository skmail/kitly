import { Extension } from "@kitly/system";
import { addFromTree } from "./modifiers/add-from-tree";
import { filterSelections } from "./modifiers/filter-selections";
import { remove } from "./modifiers/remove";

export const manager: Extension = {
  modifiers: {
    elements: {
      addFromTree,
      filterSelections,
      remove,
    },
  },
};
