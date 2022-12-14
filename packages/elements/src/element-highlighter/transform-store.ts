import { TransformMode } from "@kitly/system";
import create from "zustand";

import { subscribeWithSelector } from "zustand/middleware";
export interface TransformState {
  isTransforming: boolean;
  transformMode?: TransformMode;
  setTransform: (isTransforming: boolean, type?: TransformMode) => void;
  isSelecting: boolean;
  setIsSelecting: (isSelecting: boolean) => void;
}

export const useTransformStore = create(
  subscribeWithSelector<TransformState>((set) => ({
    isTransforming: false,
    transformMode: undefined,
    setTransform: (isTransforming, transformMode) =>
      set((state) => ({
        ...state,
        isTransforming,
        transformMode,
      })),
      
    isSelecting: false,
    setIsSelecting: (isSelecting) =>
      set((state) => ({
        ...state,
        isSelecting,
      })),
  }))
);
