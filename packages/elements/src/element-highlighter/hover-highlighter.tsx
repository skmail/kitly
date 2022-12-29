import shallow from "zustand/shallow";
import { useApp } from "@kitly/app";
import { FreeTransformElement } from "./free-transform-element";
import { Grid } from "./free-transform/grid";

export function HoverHighlighter() {
  const app = useApp();

  const transformations = app.useElementsStore((state) => {
    if (!state.hovered || state.selected.includes(state.hovered)) {
      return;
    }
    return state.transformations[state.hovered];
  }, shallow);

  
  if (!transformations) {
    return null;
  }

  return (
    <FreeTransformElement
      transformations={transformations}
      allowChanges={false}
    >
      <Grid strokeWidth={1.5} stroke="#f97316" lines={0} />
    </FreeTransformElement>
  );
}
