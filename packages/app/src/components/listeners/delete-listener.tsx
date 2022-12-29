import { shallowEqual } from "@kitly/system";
import { useEffect } from "react";
import { useApp } from "../../app-provider";

export function DeleteListener() {
  const app = useApp();
  const isDelete = app.useKeyboardStore(
    (state) => state.keyboard.Delete || state.keyboard.Backspace
  );

  useEffect(() => {
    if (!isDelete) {
      return;
    }
    const selected = app.useElementsStore.getState().selected;

    if (!selected) {
      return;
    }

    console.log("deleteing ..")
    app.useElementsStore.getState().select();
    app.useElementsStore.getState().hover();

    app.elements.remove(selected);

    app.dom.workspace?.focus();
  }, [isDelete, app]);
  return null;
}
