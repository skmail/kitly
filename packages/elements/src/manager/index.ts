import { Extension } from "@kitly/system";
import { addFromTree } from "./modifiers/add-from-tree";
import { filterSelections } from "./modifiers/filter-selections";
import { remove } from "./modifiers/remove";
import { Static } from "./ui/statics";

export const manager: Extension = {
  ui:{
    static: Static
  },
  modifiers: {
    elements: {
      addFromTree,
      filterSelections,
      remove,
    },
  },
};
