import { Element, Raycastable } from "@kitly/system";

export interface FrameElement extends Element<"frame"> {
  children: string[];
}

export interface FrameTitleRaycastResult extends Raycastable<"frame-title"> {
  id: string;
}

export interface ElementTree extends Exclude<Element, "children"> {
  children?: ElementTree[];
}
