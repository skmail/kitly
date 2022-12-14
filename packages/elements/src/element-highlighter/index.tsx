import { raycast } from "./raycast";
import { HoverHighlighter } from "./hover-highlighter";
import { SelectionTransform } from "./selection-transform";
import { ElementHighlightListener } from "./element-highlight-listener";
import { useTransformStore } from "./transform-store";
import { ExtensionDefinition } from "./types";
import { validate } from "./raycast-validation";

function ElementHighlighter() {
  return (
    <>
      <ElementHighlightListener />
      <SelectionTransform />
      <HoverHighlighter />
    </>
  );
}

export const elementHighlighter: ExtensionDefinition = {
  ui: ElementHighlighter,
  stores: {
    useTransformStore,
  },
  raycast: {
    validate,
    raycast,
  },
};
