import { Extension } from "@kitly/system";
import { Renderer } from "./renderer";

export const text: Extension = {
  elements: [
    {
      name: "text",
      // @todo fix the typing later
      // @ts-ignore
      renderer: Renderer,
      toString: () => "image string for now",
    },
  ],
};
