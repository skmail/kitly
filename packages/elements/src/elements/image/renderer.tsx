import { ImageElement } from "./types";
import { OnElementUpdate, clamp } from "@kitly/system";
import { useEffect, useRef } from "react";
export const Renderer = ({
  element,
  onUpdate,
}: {
  element: ImageElement;
  onUpdate?: OnElementUpdate;
}) => {
  const ref = useRef<HTMLImageElement>(null);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={element.src}
      alt={element.id}
      ref={ref}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
};
