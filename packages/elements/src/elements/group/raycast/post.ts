import { App, ElementsState, RaycastPost } from "@kitly/system";
import { isElementRay } from "../../../utils";
import { GroupExtension } from "../types";

const getGroups = (id: string, elements: ElementsState["elements"]) => {
  const groups: string[] = [];

  const parentId = elements[id].parentId;

  if (!parentId) {
    return groups;
  }

  groups.push(...getGroups(parentId, elements));

  if (elements[parentId].type === "group") {
    groups.push(parentId);
  }

  return groups;
};
export const post: RaycastPost = (rays, app: App<[GroupExtension]>) => {
  if (!rays.length) {
    return;
  }
  if (!isElementRay(rays[0])) {
    return;
  }

  const elements = app.useElementsStore.getState().elements;

  if (elements[rays[0].id].type === "group") {
    return [];
  }
  const state = app.stores.useGroupStore.getState();
  const groups = getGroups(rays[0].id, elements);

  if (!groups.length) {
    return;
  }

  if (!state.activeGroupId) {
    return [
      {
        type: "element",
        id: groups[0],
      },
    ];
  }
  const activeGroupIndex = groups.indexOf(state.activeGroupId);

  if (activeGroupIndex === -1) {
    return;
  }

  const groupId = groups[activeGroupIndex + 1];

  if (!groupId) {
    return;
  }

  return [
    {
      type: "element",
      id: groupId,
    },
  ];
};
