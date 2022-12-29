import { ImageElement } from "./types";
import { OnElementUpdate } from "@kitly/system";
export const Renderer = ({
  element,
  onUpdate,
}: {
  element: ImageElement;
  onUpdate?: OnElementUpdate;
}) => {
  return (
    <>
      <image
        href={element.src}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: element.width,
          height: element.height,
        }}
      />
    </>
  );
};
