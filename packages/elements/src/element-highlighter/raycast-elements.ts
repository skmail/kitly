import {
  App,
  Element,
  ElementTransformationDetails,
  Point,
  Collision,
} from "@kitly/system";
import { ElementRaycastResult } from "../types";

type TreeNode = {
  id: string;
  children: TreeNode[];
};

const dfsRaycast = (
  tree: TreeNode[],
  mouse: Point,
  transformations: Record<string, ElementTransformationDetails>
): ElementRaycastResult[] => {
  const result: ElementRaycastResult[] = [];
  for (let i = tree.length - 1; i >= 0; i--) {
    const node = tree[i];

    const id = node.id;
    const transformation = transformations[id];

    if (node.children?.length) {
      result.push(...dfsRaycast(node.children, mouse, transformations));
    }
    if (Collision.points([mouse], transformation.points)) {
      result.push({
        type: "element",
        id: node.id,
      });
    }
  }

  return result;
};

const buildTree = (
  list: { id: string }[],
  elements: Record<string, Element>,
  indexes: Record<string, number>
) => {
  const relationships: Record<string, TreeNode> = {};
  const nodes: TreeNode[] = [];

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const parentId = elements[item.id].parentId;
    let node = relationships[item.id];

    if (!node) {
      node = { id: item.id, children: [] };
    }

    if (parentId) {
      if (!relationships[parentId]) {
        relationships[parentId] = {
          id: parentId,
          children: [],
        };
      }
      relationships[parentId].children.splice(indexes[node.id], 0, node);
    }

    relationships[item.id] = node;

    if (!parentId) {
      nodes.splice(indexes[node.id], 0, node);
    }
  }

  return nodes;
};

export function raycastElements(mouse: Point, app: App) {
  const state = app.useElementsStore.getState();

  const results = app.useElementsStore
    .getState()
    .spatialTree.search({
      minX: mouse[0],
      minY: mouse[1],
      maxX: mouse[0] + 15,
      maxY: mouse[1] + 15,
    })
    .slice(0);

  const indexes = results.reduce<Record<string, number>>((acc, item) => {
    const element = state.elements[item.id];
    const parentId = element.parentId;
    if (!parentId) {
      acc[element.id] = state.ids.indexOf(element.id);
    } else {
      if (state.elements[parentId]?.children) {
        acc[element.id] = (
          state.elements[parentId].children as Array<string>
        ).indexOf(element.id);
      }
    }
    return acc;
  }, {});

  const transformations = state.transformations;

  const tree = buildTree(results, state.elements, indexes);

  const result = dfsRaycast(tree, mouse, transformations);

  return result.length ? result : undefined;
}
