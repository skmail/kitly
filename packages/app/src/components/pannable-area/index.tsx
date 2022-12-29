import { PropsWithChildren } from "react";
import shallow from "zustand/shallow";
import { useApp } from "../../app-provider";

export function PannableArea({
  children,
  component = "div",
}: PropsWithChildren<{
  component?: "div" | "svg";
}>) {
  const app = useApp();

  const [pan, size, animateZoom] = app.useWorkspaceStore(
    (state) => [state.pan, state.size, state.animateZoom],
    shallow
  );

  if (component === "svg") {
    return (
      <svg
        viewBox={`0 0 ${size[0]} ${size[1]} `}
        style={{
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
        <g
          style={{
            transform: `translate(${pan[0]}px, ${pan[1]}px)`,
          }}
        >
          {children}
        </g>
      </svg>
    );
  }
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
