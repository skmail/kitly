import { MouseButton, MouseState } from "@kitly/system";

import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export const useMouseStore = create(
  subscribeWithSelector<MouseState>((set) => ({
    mouse: [-Infinity, -Infinity],
    setMouse: (x, y) =>
      set((state) => {
        return {
          ...state,
          mouse: [x, y],
        };
      }),

    isDown: false,
    setMouseDown: (isDown = true) =>
      set((state) => {
        return {
          ...state,
          isDown,
        };
      }),

    isClick: false,
    setClick: (isClick = true) =>
      set((state) => {
        return {
          ...state,
          isClick,
        };
      }),

    isDoubleClick: false,
    setDoubleClick: (isDoubleClick = true) =>
      set((state) => {
        return {
          ...state,
          isDoubleClick,
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

    inWorkspace: false,
    setInsideWorkspace: (inWorkspace) =>
      set((state) => {
        return {
          ...state,
          inWorkspace,
        };
      }),
  }))
);
