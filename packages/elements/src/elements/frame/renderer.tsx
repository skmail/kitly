import { FrameElement } from "./types";
import { OnElementUpdate, Point } from "@kitly/system";
import { ElementsRenderer } from "@kitly/app";
import { useMemo } from "react";

export const Renderer = ({
  element,
  onUpdate,
  offset = [0, 0],
}: {
  element: FrameElement;
  onUpdate?: OnElementUpdate;
  offset?: Point;
}) => {
  const matrix3d = useMemo(
    () =>
      [
        element.matrix[0][0],
        element.matrix[1][0],
        element.matrix[0][1],
        element.matrix[1][1],
        element.matrix[0][3],
        element.matrix[1][3],
      ].join(" "),
    [element.matrix]
  );

  return (
    <>
      <rect
        x="0"
        y="0"
        style={{
          fill: "#fff",
          width: element.width,
          height: element.height,
        }}
      />

      <ElementsRenderer
        offset={[element.x + offset[0], element.y + offset[1]]}
        ids={element.children}
      />
    </>
  );
};
