import { useApp } from "@kitly/app";
import { usePrevious } from "@kitly/app/src/hooks/usePrevious";
import { ElementsState, shallowEqual } from "@kitly/system";
import { useEffect } from "react";
import { ElementHighlighterExtension } from "@kitly/elements/src/element-highlighter/types";
import { isElementRay } from "@kitly/elements/src/utils";
import { GroupExtension } from "./types";

const getParents = (id: string, elements: ElementsState["elements"]) => {
  const parents: string[] = [];

  const element = elements[id];

  if (element.parentId) {
    parents.push(element.parentId, ...getParents(element.parentId, elements));
  }

  return parents;
};

export function GroupActivationHandler() {
  const app = useApp<[GroupExtension, ElementHighlighterExtension]>();
  const [isDown, isDoubleClick] = app.useMouseStore(
    (state) => [state.isDown, state.isDoubleClick],
    shallowEqual
  );

  const isTransforming = app.stores.useTransformStore(
    (state) => state.isTransforming,
    shallowEqual
  );
  const wasTransforming = usePrevious(isTransforming);
  const wasDown = usePrevious(isDown);

  useEffect(() => {
    if (!isDoubleClick) {
      return;
    }

    const rays = app.useRaycastStore.getState().rays;
    const elementsState = app.useElementsStore.getState();
    const groupState = app.stores.useGroupStore.getState();
    const parents = groupState.activeGroupId
      ? getParents(groupState.activeGroupId, elementsState.elements)
      : [];

    for (let i = rays.length - 1; i >= 0; i--) {
      const ray = rays[i];
      if (!isElementRay(ray)) {
        continue;
      }

      if (ray.id === groupState.activeGroupId || parents.includes(ray.id)) {
        continue;
      }

      if (elementsState.elements[ray.id].type === "group") {
        groupState.setActiveGroupId(ray.id);
        const selections: string[] = [];

        for (let j = i - 1; j > 0; j--) {
          const ray = rays[j];

          if (isElementRay(ray)) {
            selections.push(ray.id);
            break;
          }
        }
        elementsState.select(selections);
        elementsState.hover();

        return;
      }
    }
  }, [isDoubleClick, app]);

  useEffect(() => {
    if (isDown || !wasDown || wasTransforming) {
      return;
    }

    const rays = app.useRaycastStore.getState().rays;
    const elementsState = app.useElementsStore.getState();
    const groupState = app.stores.useGroupStore.getState();

    for (let i = rays.length - 1; i >= 0; i--) {
      const ray = rays[i];
      if (isElementRay(ray) && ray.id === groupState.activeGroupId) {
        return;
      }
    }

    if (groupState.activeGroupId) {
      groupState.setActiveGroupId();

      if (elementsState.selected.length) {
        const parents = getParents(elementsState.selected[0], elementsState.elements);

        if (parents.includes(groupState.activeGroupId)) {
          elementsState.select([groupState.activeGroupId]);
        }
      }
    }
  }, [
    app.stores.useGroupStore,
    app.useElementsStore,
    app.useRaycastStore,
    isDown,
    isTransforming,
    wasDown,
    wasTransforming,
  ]);
  return null;
}
