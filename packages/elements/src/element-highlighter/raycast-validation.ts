import { App } from "@kitly/system";
import { ElementHighlighterExtension } from "./types";

export function validate(app: App<[ElementHighlighterExtension]>) {
  const { isSelecting, isTransforming } =
    app.stores.useTransformStore.getState();

  if (isSelecting || isTransforming) {
    return false;
  }
}
