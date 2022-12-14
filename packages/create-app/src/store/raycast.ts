import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { RaycastState } from "@kitly/system";

export const useRaycastStore = create(
  subscribeWithSelector<RaycastState>((set) => ({
    ray: undefined,
    setRay: (raycastables) =>
      set((state) => {
        return {
          ...state,
          ray: raycastables,
        };
      }),
  }))
);
