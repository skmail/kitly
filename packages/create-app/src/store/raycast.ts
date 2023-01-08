import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { RaycastState } from "@kitly/system";

export const useRaycastStore = create(
  subscribeWithSelector<RaycastState>((set) => ({
    rays: [],
    setRays: (rays) =>
      set((state) => {
        return {
          ...state,
          rays,
        };
      }),
  }))
);
