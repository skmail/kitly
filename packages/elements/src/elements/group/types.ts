import { Element } from "@kitly/system";
import { Extension, Store } from "@kitly/system";
 
export interface GroupElement extends Element<"group"> {
  children: string[];
}

export interface GroupStoreState {
  activeGroupId?: string;
  setActiveGroupId(activeGroupId?: string): void;
}

export interface GroupExtension extends Extension {
  stores: {
    useGroupStore: Store<GroupStoreState>;
  };
}
