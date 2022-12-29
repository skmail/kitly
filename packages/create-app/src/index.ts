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
  frame,
  manager,
} from "@kitly/elements";

function applyModifier<T extends App>(
  app: T,
  modifiers: ExtensionModifierDetailed[],
  ...args: any[]
) {
  let lastValue: any;
  for (let modifier of modifiers) {
    const value = modifier.modifier(...args, app, lastValue);
    if (value !== undefined) {
      lastValue = value;
    }
  }

  return lastValue;
}
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

function createModifiers(app: App, extensions: Extension[]) {
  const detailedModifiers: {
    [key: string]: Record<string, ExtensionModifierDetailed[]>;
  } = {};

  for (let extension of extensions) {
    if (extension.modifiers) {
      for (let [target, modifiersTarget] of Object.entries(
        extension.modifiers
      )) {
        for (let [action, modifierActions] of Object.entries(modifiersTarget)) {
          if (!detailedModifiers[target]) {
            detailedModifiers[target] = {};
          }

          if (!detailedModifiers[target][action]) {
            detailedModifiers[target][action] = [];
          }

          const actions = detailedModifiers[target][action];

          if (Array.isArray(modifierActions)) {
            actions?.push(...modifierActions.map(foreceDefaultModifier));
          } else {
            actions?.push(foreceDefaultModifier(modifierActions));
          }
        }
      }
    }
  }

  const modifiers = Object.entries(detailedModifiers).reduce<any>(
    (acc, [name, modifiers]) => {
      return {
        ...acc,
        [name]: Object.entries(modifiers).reduce<Record<string, () => void>>(
          (acc, [name, modifiers]) => {
            modifiers = modifiers.sort(
              (a, b) =>
                (a as ExtensionModifierDetailed).priorty -
                (b as ExtensionModifierDetailed).priorty
            );

            return {
              ...acc,
              [name]: (...args: any[]) =>
                applyModifier(app, modifiers, ...args),
            };
          },
          {}
        ),
      };
    },
    {}
  );

  return modifiers;
}
export function createApp(
  extensions: Extension[] = [
    elementHighlighter,
    multiselect,
    image,
    text,
    group,
    frame,
    manager,
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
  };

  Object.assign(app, createModifiers(app, extensions));

  return app;
}
