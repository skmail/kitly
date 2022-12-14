import { KeyboardState } from "@kitly/system";
import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export const useKeyboardStore = create(
  subscribeWithSelector<KeyboardState>((set) => ({
    keyboard: {},
    setKeys: (keys: Record<string, boolean>) =>
      set((state) => ({
        ...state,
        keyboard: {
          ...state.keyboard,
          ...keys,
        },
      })),

    resetKeys: () =>
      set((state) => ({
        ...state,
        keyboard: {},
      })),
  }))
);
