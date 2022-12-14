import { Extension } from "@kitly/system";
import { Renderer } from "./renderer";

export const image: Extension = {
  elements: [
    {
      name: "image",
      // @todo fix the typing later
      // @ts-ignore
      renderer: Renderer,
      toString: () => "image string for now",
    },
  ],
};
