import { App } from "@kitly/system";
import { ExtensionDefinition } from "./types";

export function validate(app: App<[ExtensionDefinition]>) {
  const { isSelecting, isTransforming } =
    app.stores.useTransformStore.getState();

  if (isSelecting || isTransforming) {
    return false;
  }
}
