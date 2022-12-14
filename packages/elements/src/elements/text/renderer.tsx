import { TextElement } from "./types";
import { OnElementUpdate } from "@kitly/system";
import { useEffect, useMemo, useRef } from "react";

export const Renderer = ({
  element,
  onUpdate,
}: {
  element: TextElement;
  onUpdate?: OnElementUpdate;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const text = useMemo(() => {
    return element.text;
  }, [element.text]);

  useEffect(() => {
    if (!ref.current || !onUpdate) {
      return;
    }

    const dom = ref.current?.parentElement;
    if (!dom) {
      return;
    }

    const styles = {
      transform: dom.style.transform,
      width: dom.style.width,
      height: dom.style.height,
    };
    dom.style.transform = "";
    dom.style.width = "";
    dom.style.height = "";
    const bounds = dom.getBoundingClientRect();
    dom.style.transform = styles.transform;
    dom.style.width = styles.width;
    dom.style.height = styles.height;
    onUpdate(element.id, {
      width: bounds.width,
      height: bounds.height,
    });
  }, [element.id, onUpdate]);

  return (
    <span
      style={{
        fontSize: "14px",
        whiteSpace: "pre-line",
      }}
      ref={ref}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};
