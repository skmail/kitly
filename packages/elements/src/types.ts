import { Point, Raycastable, TransformMode } from "@kitly/system";

export interface HandleRaycastResult extends Raycastable<"handle"> {
  mode: TransformMode;
  handle: Point;
}

export interface ElementRaycastResult extends Raycastable<"element"> {
  id: string;
}

export interface SelectionRaycastResult extends Raycastable<"selection"> {}

export type RaycastResult = HandleRaycastResult | ElementRaycastResult | SelectionRaycastResult;
