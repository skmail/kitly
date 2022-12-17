import { Extension } from "@kitly/system";
import { Renderer } from "./renderer";

export const group: Extension = {
  elements: [
    {
      name: "group",
      // @todo fix the typing later
      // @ts-ignore
      renderer: Renderer,
      toString: () => "group string for now",
      transformRenderrer: false,
    },
  ],
};
