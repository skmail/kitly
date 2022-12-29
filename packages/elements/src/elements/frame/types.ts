import { Element } from "@kitly/system";

export interface FrameElement extends Element<"frame"> {
  children: string[];
}
