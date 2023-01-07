import {
  applyToPoint,
  applyToPoints,
  decompose,
  Element,
  inverseAffine,
  matrixScale,
  minMax,
  multiply,
  Point,
} from "@kitly/system";

interface ElementTree extends Exclude<Element, "children"> {
  children?: ElementTree[];
}

function calculateTransformations(element: Element, points: Point[]) {
  const decomposed = decompose(element.matrix);
  const rotationMatrix = multiply(
    element.matrix,
    inverseAffine(matrixScale(decomposed.scale.sx, decomposed.scale.sy))
  );

  //  reset the translation
  rotationMatrix[0][3] = 0;
  rotationMatrix[1][3] = 0;

  //  flip b,c due to the matrix inversion
  rotationMatrix[0][1] *= -1;
  rotationMatrix[1][0] *= -1;

  const box = minMax(applyToPoints(rotationMatrix, points));

  // inverse the rotation matrix to get original points
  const original = inverseAffine(rotationMatrix);

  const [x, y] = applyToPoint(original, [box.xmin, box.ymin]);

  // revert b,c
  rotationMatrix[0][1] *= -1;
  rotationMatrix[1][0] *= -1;

  return {
    x,
    y,
    width: box.width,
    height: box.height,
    matrix: rotationMatrix,
  };
}
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
