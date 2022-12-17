import { MouseButton, MouseState } from "@kitly/system";

import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export const useMouseStore = create(
  subscribeWithSelector<MouseState>((set) => ({
    mouse: [-Infinity, -Infinity],
    isDown: false,
    inWorkspace: false,
    setInsideWorkspace: (inWorkspace) =>
      set((state) => {
        return {
          ...state,
          inWorkspace,
        };
      }),

    setMouse: (x, y) =>
      set((state) => {
        return {
          ...state,
          mouse: [x, y],
        };
      }),
    setMouseDown: (isDown = true) =>
      set((state) => {
        return {
          ...state,
          isDown,
        };
      }),

    button: MouseButton.LEFT,

    setButton: (button) =>
      set((state) => {
        return {
          ...state,
          button,
        };
      }),
  }))
);
