import { FC } from "react";
import { useElementsStore } from "./store/elements";
import { useMouseStore } from "./store/mouse";
import { useWorkspaceStore } from "./store/workspace";
import { useKeyboardStore } from "./store/keyboard";
import { useRaycastStore } from "./store/raycast";
import {
  elementHighlighter,
  image,
  multiselect,
  text,
  group,
} from "@kitly/elements";
import {
  App,
  ElementExtension,
  Extension,
  Raycaster,
  RaycastPost,
  RaycastValidator,
  Store,
} from "@kitly/system";

export function createApp(
  extensions: Extension[] = [
    elementHighlighter,
    multiselect,
    image,
    text,
    group,
  ]
): App {
  const raycasters: {
    raycasters: Raycaster[];
    validators: RaycastValidator[];
    post: RaycastPost[];
  } = {
    raycasters: [],
    validators: [],
    post: [],
  };

  const elements = new Map<string, ElementExtension>();
  const ui: FC[] = [];

  let stores: Record<string, Store<any>> = {};

  for (let extension of extensions) {
    if (extension.elements) {
      for (let element of extension.elements) {
        elements.set(element.name, element);
      }
    }
    if (extension.raycast?.raycast) {
      raycasters.raycasters.push(extension.raycast?.raycast);
    }
    if (extension.raycast?.validate) {
      raycasters.validators.push(extension.raycast?.validate);
    }
    if (extension.raycast?.post) {
      raycasters.post.push(extension.raycast?.post);
    }
    if (extension.ui) {
      ui.push(extension.ui);
    }
    if (extension.stores) {
      stores = {
        ...stores,
        ...extension.stores,
      };
    }
  }

  return {
    stores,
    useElementsStore,
    useWorkspaceStore,
    useMouseStore,
    useKeyboardStore,
    useRaycastStore,
    dom: {
      workspace: undefined,
    },
    extensions: {
      elements,
      raycasters,
      ui,
    },
  };
}
