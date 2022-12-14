import { shallowEqual } from "@kitly/system";
import { useEffect } from "react";
import { useApp } from "../../app-provider";

export default function KeyboardListener() {
  const app = useApp();

  const keyboard = app.useKeyboardStore(
    (state) => ({
      setKeys: state.setKeys,
      resetKeys: state.resetKeys,
    }),
    shallowEqual
  );

  useEffect(() => {
    const root = app.dom.workspace;

    if (!root) {
      return;
    }

    if (!root) {
      return;
    }

    const shouldDetectKeys = (event: KeyboardEvent) => {
      const targetElement = event.target as HTMLElement;
      const target = String(targetElement.tagName).toLowerCase();

      return ["textarea", "input", "button"].includes(target) === false;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (!shouldDetectKeys(e)) {
        return;
      }
      keyboard.setKeys({
        [e.code]: true,
      });
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (!shouldDetectKeys(e)) {
        return;
      }

      keyboard.setKeys({
        [e.code]: false,
      });
    };

    const onBlur = () => {
      keyboard.resetKeys();
    };

    root.addEventListener("keydown", onKeyDown);
    root.addEventListener("keyup", onKeyUp);
    root.addEventListener("blur", onBlur);

    return () => {
      root.removeEventListener("keydown", onKeyDown);
      root.removeEventListener("keyup", onKeyUp);
      root.removeEventListener("blur", onBlur);
    };
  }, [app.dom.workspace, keyboard]);

  return null;
}
