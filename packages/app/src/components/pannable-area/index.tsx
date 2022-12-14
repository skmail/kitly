import { PropsWithChildren } from "react";
import shallow from "zustand/shallow";
import { useApp } from "../../app-provider";

export function PannableArea({ children }: PropsWithChildren<{}>) {
  const app = useApp();

  const [pan, size, animateZoom] = app.useWorkspaceStore(
    (state) => [state.pan, state.size, state.animateZoom],
    shallow
  );

  return (
    <div
      style={{
        transform: `translate(${pan[0]}px, ${pan[1]}px)`,
        width: size[0],
        height: size[1],
        transformOrigin: "0 0",
        transition: animateZoom ? `all 0.3s linear` : undefined,
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {children}
    </div>
  );
}
