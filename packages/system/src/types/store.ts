import { Point } from "@free-transform/core";
import type { StoreApi, UseBoundStore } from "zustand";
import { ElementTransformationDetails, MouseButtonType, Element } from ".";
import { Raycastable } from "./app";
import { SpatialElement, SpatialTree } from "./spatial-tree";

export type Store<T> = UseBoundStore<StoreApi<T>>;

export interface KeyboardState {
  keyboard: Record<string, boolean>;
  setKeys: (keys: Record<string, boolean>) => void;
  resetKeys: () => void;
}

export interface MouseState {
  mouse: Point;
  setMouse: (x: number, y: number) => void;
  setMouseDown: (isDown?: boolean) => void;

  button: MouseButtonType;
  setButton: (button: MouseButtonType) => void;

  isDown: boolean;

  inWorkspace: boolean;
  setInsideWorkspace: (inWorkspace: boolean) => void;
}

export interface ElementsState {
  spatialTree: SpatialTree<SpatialElement>;
  ids: string[];
  elements: Record<string, Element>;

  transformations: Record<string, ElementTransformationDetails>;

  selectionTransformations: {
    transformations?: ElementTransformationDetails;
    originals: Record<string, ElementTransformationDetails>;
    original?: ElementTransformationDetails;
  };
  update(id: string | string[], data: Partial<Element>): void;
  deleteElement(ids: string[]): void;

  addMany: <T extends Element>(elements: T[]) => void;

  hovered?: string;
  hover(id?: string): void;
  selected: string[];
  select(ids?: string[]): void;
}

export interface RaycastState {
  ray?: Raycastable;
  stack: Raycastable[];
  setRay: (raycastable?: Raycastable, stack?: Raycastable[]) => void;
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
