import { ComponentProps, useMemo } from "react";
import {
  computeElementTransformations,
  Element,
  ElementTransformationDetails,
  OnElementUpdate,
} from "@kitly/system";
import { Transformed } from "./transformed";
import { useApp } from "../../app-provider";

export function Renderer({
  element,
  render = true,
  onUpdate,
  transformations,
  ...rest
}: ComponentProps<"div"> & {
  element: Element;
  render?: boolean;
  onUpdate: OnElementUpdate;
  transformations?: ElementTransformationDetails;
}) {
  let rendered: any = null;

  const app = useApp();

  const Renderer = app.extensions.elements.get(element.type)?.renderer;

  transformations = useMemo(() => {
    if (transformations) {
      return transformations;
    }
    return computeElementTransformations(element);
  }, [transformations, element]);

  if (!Renderer) {
    return null;
  }

  if (render) {
    rendered = <Renderer element={element} onUpdate={onUpdate} />;
  }
  return (
    <Transformed transformations={transformations} {...rest}>
      {rendered}
    </Transformed>
  );
}
