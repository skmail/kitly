import { GroupElement } from "../types";
import {
  ElementTransformationDetails,
  OnElementUpdate,
  Point,
} from "@kitly/system";
import { ElementsRenderer } from "@kitly/app";

export const Renderer = ({
  element,
  onUpdate,
  offset = [0, 0],
  transformations,
}: {
  element: GroupElement;
  onUpdate?: OnElementUpdate;
  offset?: Point;
  transformations: ElementTransformationDetails;
}) => {
  return (
    <g transform={`translate(${transformations.x} ${transformations.y})`}>
      <ElementsRenderer ids={element.children} />
    </g>
  );
};
