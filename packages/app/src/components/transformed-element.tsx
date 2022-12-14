import { ComponentProps, useCallback } from "react";
import shallow from "zustand/shallow";
import { OnElementUpdate } from "@kitly/system";
import { Renderer } from "./elements-renderer/renderer";
import { useApp } from "../app-provider";

export function TransformedElement({
  id,
  render = true,
  ...rest
}: ComponentProps<"div"> & { id: string; render?: boolean }) {
  const app = useApp();

  const element = app.useElementsStore((state) => state.elements[id], shallow);

  const onUpdate = useCallback<OnElementUpdate>(
    (id, payload) => {
      app.useElementsStore.getState().update(id, payload);
    },
    [app.useElementsStore]
  );

  return (
    <Renderer
      onUpdate={onUpdate}
      {...rest}
      element={element}
      render={render}
    />
  );
}
