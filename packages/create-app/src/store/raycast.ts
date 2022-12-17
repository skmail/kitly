import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { RaycastState } from "@kitly/system";

export const useRaycastStore = create(
  subscribeWithSelector<RaycastState>((set) => ({
    ray: undefined,
    stack: [],
    setRay: (raycastables, stack = []) =>
      set((state) => {
        return {
          ...state,
          ray: raycastables,
          stack,
        };
      }),
  }))
);
