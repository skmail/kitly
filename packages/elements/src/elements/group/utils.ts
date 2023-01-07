import {
  applyToPoint,
  applyToPoints,
  decompose,
  Element,
  ElementTransformationDetails,
  inverseAffine,
  matrixScale,
  minMax,
  multiply,
  Point,
  applyOffsetToPoints,
} from "@kitly/system";

interface ElementTree extends Exclude<Element, "children"> {
  children?: ElementTree[];
}

function calculateTransformations(
  element: Element,
  points: Point[],
  transformations?: ElementTransformationDetails
) {
  const decomposed = transformations || decompose(element.matrix);
  const rotationMatrix =
    transformations?.rotationMatrix ||
    multiply(
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
export function fitGroupTree(
  element: ElementTree,
  transformations?: Record<string, ElementTransformationDetails>
): ElementTree {
  if (!element.children?.length) {
    return element;
  }

  const children = element.children.map((child) => fitGroupTree(child));

  const points = children.flatMap((child) => {
    return transformations?.[child.id]
      ? transformations?.[child.id].points
      : applyToPoints(child.matrix, [
          [child.x, child.y],
          [child.x + child.width, child.y],
          [child.x + child.width, child.y + child.height],
          [child.x, child.y + child.height],
        ]);
  });

  const position = calculateTransformations(
    element,
    points,
    transformations?.[element.id]
  );

  return {
    ...element,
    children: children.map((child) => {
      return {
        ...child,
        x: child.x - position.x,
        y: child.y - position.y,
      };
    }),

    ...position,
  };
}

export function fitGroupTable(
  id: string,
  table: {
    ids: string[];
    elements: Record<string, Element>;
  }
) {
  const element = table.elements[id];

  if (!element.children?.length) {
    return {
      [id]: element,
    };
  }

  let newTable: Record<string, Element> = {};
  for (let id of element.children) {
    newTable = {
      ...newTable,
      ...fitGroupTable(id, table),
    };
  }

  const points = element.children.flatMap((id) => {
    return applyToPoints(newTable[id].matrix, [
      [newTable[id].x, newTable[id].y],
      [newTable[id].x + newTable[id].width, newTable[id].y],
      [
        newTable[id].x + newTable[id].width,
        newTable[id].y + newTable[id].height,
      ],
      [newTable[id].x, newTable[id].y + newTable[id].height],
    ]);
  });

  return {
    ...newTable,
    [id]: {
      ...element,
      ...calculateTransformations(element, points),
    },
  };
}

export function fitElementParents(
  id: string,
  elements: Record<string, Element>,
  transformations?: Record<string, ElementTransformationDetails>
): {
  elements: Record<string, Element>;
  root?: string;
} {
  const element = elements[id];
  const parentId = element.parentId;

  if (!parentId) {
    return {
      elements: {},
    };
  }

  const parent = elements[parentId];
  if (!parent.children) {
    return {
      elements: {},
    };
  }

  const result: Record<string, Element> = {};

  if (parent.type === "group") {
    const points = parent.children.flatMap((id) => {
      return applyOffsetToPoints(
        applyToPoints(elements[id].matrix, [
          [0, 0],
          [elements[id].width, 0],
          [elements[id].width, elements[id].height],
          [0, elements[id].height],
        ]),
        [parent.x + elements[id].x, parent.y + elements[id].y]
      );
    });
    result[parentId] = {
      ...parent,
      ...calculateTransformations(parent, points, transformations?.[parentId]),
    };
  }

  for (let child of parent.children) {
    const element = elements[child];
    result[element.id] = {
      ...element,
      x: elements[child].x + parent.x - result[parentId].x,
      y: elements[child].y + parent.y - result[parentId].y,
    };
  }

  const parentresult = fitElementParents(parentId, {
    ...elements,
    ...result,
  });

  return {
    elements: {
      ...result,
      ...parentresult.elements,
    },
    root: parentresult.root || parentId,
  };
}
