import { raycast } from "./raycast";
import { HoverHighlighter } from "./hover-highlighter";
import { SelectionTransform } from "./selection-transform";
import { ElementHighlightListener } from "./element-highlight-listener";
import { useTransformStore } from "./transform-store";
import { ElementHighlighterExtension } from "./types";
import { validate } from "./raycast-validation";
import { update } from "./modifiers/update";
import { _transform } from "./modifiers/transform";

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
    elements: {
      transform: [
        {
          priorty: Infinity - 1,
          modifier: _transform,
        },
      ],
      update: [
        {
          priorty: Infinity,
          modifier: update,
        },
      ],
    },
  },
};
