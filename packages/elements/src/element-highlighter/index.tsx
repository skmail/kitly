import { raycast } from "./raycast";
import { HoverHighlighter } from "./hover-highlighter";
import { SelectionTransform } from "./selection-transform";
import { ElementHighlightListener } from "./element-highlight-listener";
import { useTransformStore } from "./transform-store";
import { ElementHighlighterExtension } from "./types";
import { validate } from "./raycast-validation";
import { update } from "./modifiers/update";
import { _transform } from "./modifiers/transform";
import { App, Element } from "@kitly/system";

function ElementHighlighter() {
  return (
    <>
      <ElementHighlightListener />
      <SelectionTransform />
      <HoverHighlighter />
    </>
  );
}

export const elementHighlighter: ElementHighlighterExtension = {
  ui: {
    pannable: ElementHighlighter,
  },

  stores: {
    useTransformStore,
  },
  raycast: {
    validate,
    raycast,
  },
  modifiers: {
    selection: {
      update(changes: Partial<Element>, app: App) {
        app.elements.update(app.useElementsStore.getState().selected, changes);
      },
      isEnabled(app: App) {
        return app.useElementsStore.getState().selected.length;
      },
      isTranslate(ray) {
        return (
          ray.type === "element" ||
          ray.type === "selection" ||
          ray.type === "frame-title"
        );
      },
    },
    elements: {
      transform: [
        {
          priority: Infinity - 1,
          modifier: _transform,
        },
      ],
      update: [
        {
          priority: Infinity,
          modifier: update,
        },
      ],
    },
  },
};
