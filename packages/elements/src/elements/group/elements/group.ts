import { ElementExtension } from "@kitly/system";
import { transformChildren } from "../modifiers/transform-children";
import { Icon } from "./icon";
import { Renderer } from "./renderer";

export const group: ElementExtension = {
  name: "group",
  // @TODO fix the typing later
  // @ts-ignore
  renderer: Renderer,
  toString: () => "group string for now",
  transformRenderrer: false,
  modifiers: {
    transform: transformChildren,
  },
  icon: Icon
};
