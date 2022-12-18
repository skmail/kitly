import { WorkspaceState } from "@kitly/system";
import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export const useWorkspaceStore = create(
  subscribeWithSelector<WorkspaceState>((set) => ({
    zoom: 1,
    rulers: {
      vertical: true,
      horizontal: true,
    },
    setRulers: (rulers) =>
      set((state) => {
        if (typeof rulers === "boolean") {
          rulers = {
            horizontal: rulers,
            vertical: rulers,
          };
        }
        return {
          ...state,
          rulers,
        };
      }),

    setZoom: (zoom, pan, animateZoom) =>
      set((state) => {
        return {
          ...state,
          zoom,
          pan: pan || state.pan,
          animateZoom,
        };
      }),

    animateZoom: false,
    setAnimateZoom: (animateZoom = false) =>
      set((state) => {
        return {
          ...state,
          animateZoom,
        };
      }),

    size: [0, 0],
    setSize: (size) =>
      set((state) => {
        return {
          ...state,
          size,
        };
      }),

    pan: [0, 0],
    setPan: (pan) =>
      set((state) => {
        return {
          ...state,
          pan,
        };
      }),
    offset: [0, 0],
    setOffset: (offset) =>
      set((state) => {
        return {
          ...state,
          offset: offset,
        };
      }),
  }))
);
