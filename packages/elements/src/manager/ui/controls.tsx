import { useApp } from "@kitly/app";
import { useEffect } from "react";

const frame = (
  callback: (data: { elapsed: number }) => void,
  runAfter = 300
) => {
  let start: number;
  let previousTimeStamp: number;

  let animation: number;
  function step(timestamp: number) {
    if (start === undefined) {
      start = timestamp;
    }
    const elapsed = timestamp - start;

    if (previousTimeStamp !== timestamp) {
      callback({ elapsed });
    }
    animation = window.requestAnimationFrame(step);
  }

  let timeout = setTimeout(() => {
    animation = window.requestAnimationFrame(step);
  }, runAfter);

  return () => {
    clearTimeout(timeout);
    window.cancelAnimationFrame(animation);
  };
};
const useKeyboardMove = (key: string, attribute: "x" | "y", sign = 1) => {
  const app = useApp();
  const [keyboard, shift] = app.useKeyboardStore((state) => [
    state.keyboard[key],
    state.keyboard.ShiftLeft,
  ]);

  useEffect(() => {
    const state = app.useElementsStore.getState();
    const zoom = app.useWorkspaceStore.getState().zoom;
    const selected = state.selected;
    if (!selected.length || !state.selectionTransformations || !keyboard) {
      return;
    }
    const amount = (shift ? 15 : 1) * sign;
    const update = () => {
      const state = app.useElementsStore.getState();
      if (!state.selectionTransformations) {
        return;
      }
      app.selection.update({
        [attribute]: state.selectionTransformations[attribute] + amount / zoom,
      });
    };

    update();
    const stop = frame(({ elapsed }) => {
      const a = Math.round(elapsed % amount);
      if (a === Math.abs(amount)) {
        update();
      }
    });
    return () => {
      stop();
    };
  }, [app, attribute, keyboard, shift, sign]);
};
export function Controls() {
  useKeyboardMove("ArrowDown", "y");
  useKeyboardMove("ArrowUp", "y", -1);
  useKeyboardMove("ArrowLeft", "x", -1);
  useKeyboardMove("ArrowRight", "x");
  return null;
}
