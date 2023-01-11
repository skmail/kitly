import { ElementTree } from "./types";

export function fitFrameTreeContents(element: ElementTree): ElementTree {
  if (!element.children?.length) {
    return element;
  }

  const children = element.children.map((child) => {
    child = {
      ...child,
      x: child.x - element.x,
      y: child.y - element.y,
    };

    if (child.children) {
      child = fitFrameTreeContents(child);
    }
    return child;
  });

  return {
    ...element,
    children,
  };
}
