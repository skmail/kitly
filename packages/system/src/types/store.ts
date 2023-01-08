import { Point } from "@free-transform/core";
import type { StoreApi, UseBoundStore } from "zustand";
import type { subscribeWithSelector } from "zustand/middleware";
import { ElementTransformationDetails, MouseButtonType, Element } from ".";
import { Raycastable } from "./app";
import { SpatialElement, SpatialTree } from "./spatial-tree";

export type Store<T> = UseBoundStore<StoreApi<T>> & {
  subscribe: {
    (
      listener: (selectedState: T, previousSelectedState: T) => void
    ): () => void;
    <U>(
      selector: (state: T) => U,
      listener: (selectedState: U, previousSelectedState: U) => void,
      options?: {
        equalityFn?: (a: U, b: U) => boolean;
        fireImmediately?: boolean;
      }
    ): () => void;
  };
};

export interface KeyboardState {
  keyboard: Record<string, boolean>;
  setKeys: (keys: Record<string, boolean>) => void;
  resetKeys: () => void;
}

export interface MouseState {
  mouse: Point;
  setMouse: (x: number, y: number) => void;

  button: MouseButtonType;
  setButton: (button: MouseButtonType) => void;

  isDown: boolean;
  setMouseDown: (isDown?: boolean) => void;

  isClick: boolean;
  setClick: (isClick?: boolean) => void;

  isDoubleClick: boolean;
  setDoubleClick: (isDoubleClick?: boolean) => void;

  inWorkspace: boolean;
  setInsideWorkspace: (inWorkspace: boolean) => void;
}

export interface ElementsState {
  spatialTree: SpatialTree<SpatialElement>;
  ids: string[];
  elements: Record<string, Element>;
  globalPosition: Record<string, Point>;

  transformations: Record<string, ElementTransformationDetails>;

  selectionTransformations?: ElementTransformationDetails;
  update(data: Partial<ElementsState>): void;
  deleteElement(ids: string[]): void;

  hovered?: string;
  hover(id?: string): void;
  selected: string[];
  select(ids?: string[]): void;
}

export interface RaycastState {
  rays: Raycastable[];
  setRays: (raycastables: Raycastable[]) => void;
}

type RulerState = {
  vertical: boolean;
  horizontal: boolean;
};

export interface WorkspaceState {
  offset: Point;
  setOffset: (offset: Point) => void;

  animateZoom: boolean;
  zoom: number;

  setZoom: (amount: number, pan?: Point, animate?: boolean) => void;
  setAnimateZoom: (animateZoom?: boolean) => void;

  pan: Point;
  setPan: (pan: Point) => void;

  size: Point;
  setSize: (size: Point) => void;

  rulers: RulerState;
  setRulers(state: boolean | RulerState): void;
}
