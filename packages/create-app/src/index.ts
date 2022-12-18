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
  ExtensionModifier,
  ExtensionModifierDetailed,
  ExtensionModifierCallback,
} from "@kitly/system";

const foreceDefaultModifier = (
  modifier: ExtensionModifier
): ExtensionModifierDetailed => {
  if (typeof modifier === "function") {
    return {
      priorty: 100,
      modifier,
    };
  }
  return modifier;
};

type AppExtensionsModifiersMap<T extends ExtensionModifier> = Map<string, T[]>;

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

  const detailedModifiers: {
    [key: string]: ExtensionModifierDetailed[];
  } = {};

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
    if (extension.modifiers) {
      for (let [target, modifiersTarget] of Object.entries(
        extension.modifiers
      )) {
        for (let [action, modifierActions] of Object.entries(modifiersTarget)) {
          const key = `${target}.${action}`;

          if (!detailedModifiers[key]) {
            detailedModifiers[key] = [];
          }
          const actions = detailedModifiers[key];

          if (Array.isArray(modifierActions)) {
            actions?.push(...modifierActions.map(foreceDefaultModifier));
          } else {
            actions?.push(foreceDefaultModifier(modifierActions));
          }
        }
      }
    }
  }

  const modifiers = Object.entries(detailedModifiers).reduce<App["modifiers"]>(
    (acc, [name, modifiers]) => {
      return {
        ...acc,
        [name]: modifiers
          .sort(
            (a, b) =>
              (a as ExtensionModifierDetailed).priorty -
              (b as ExtensionModifierDetailed).priorty
          )
          .map((modifier) => (modifier as ExtensionModifierDetailed).modifier),
      };
    },
    {}
  );

  const app = {
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
    modifiers,
    applyModifier(name: string, ...args: any[]) {
      if (!modifiers[name]) {
        return;
      }
      let lastValue: any;
      for (let modifier of modifiers[name]) {
        lastValue = modifier(...args, app);
      }

      return lastValue;
    },
  };

  return app;
}
