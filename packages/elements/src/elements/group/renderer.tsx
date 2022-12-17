import { GroupElement } from "./types";
import { OnElementUpdate } from "@kitly/system";
import { ElementsRenderer } from "@kitly/app";

export const Renderer = ({
  element,
  onUpdate,
}: {
  element: GroupElement;
  onUpdate?: OnElementUpdate;
}) => {
  return <ElementsRenderer ids={element.children} />;
};
