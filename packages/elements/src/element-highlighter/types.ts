import { Extension, Store } from "@kitly/system";
import { TransformState } from "./transform-store";

export interface ExtensionDefinition extends Extension {
  stores: {
    useTransformStore: Store<TransformState>;
  };
}
