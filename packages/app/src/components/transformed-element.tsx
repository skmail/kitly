import { ComponentProps } from "react";
import shallow from "zustand/shallow";
import { Renderer } from "./elements-renderer/renderer";
import { useApp } from "../app-provider";

export function TransformedElement({
  id,
  render = true,
  ...rest
}: Omit<ComponentProps<"g">, "offset"> & {
  id: string;
  render?: boolean;
}) {
  const app = useApp();

  const element = app.useElementsStore((state) => state.elements[id], shallow);

  const transformations = app.useElementsStore(
    (state) => state.transformations[id],
    shallow
  );

  return (
    <Renderer
      {...rest}
      element={element}
      transformations={transformations}
      render={render}
    />
  );
}
