import { PropsWithChildren } from "react";
import type { App } from "@kitly/system";
import { AppProvider } from "./app-provider";
import { DropLayer } from "./components/drop-layer";
import classNames from "classnames";
import { Listeners } from "./components/listeners";
import { Frame } from "./components/frame";
import { ZoomableArea } from "./components/zoomable-area";
import { PannableArea } from "./components/pannable-area";
import { ElementsRenderer } from "./components/elements-renderer";
import { Rulers } from "./components/rulers";
import { WorkspaceCursor } from "./components/workspace-cursor";
import { Debug } from "./components/debug";

export function App({ app }: PropsWithChildren<{ app: App }>) {
  if (!app) {
    throw new Error("app is not configured");
  }

  return (
    <AppProvider app={app}>
      <DropLayer
        className={classNames({
          "relative overflow-hidden bg-white bg-zinc-900 w-full h-full focus:outline-none":
            true,
        })}
        ref={(ref) => {
          app.dom.workspace = ref ? ref : undefined;
        }}
        tabIndex={0}
      >
        <Listeners />

        <Frame>
          <PannableArea>
            <ZoomableArea>
              <ElementsRenderer />
            </ZoomableArea>
          </PannableArea>
        </Frame>

        <PannableArea>
          {app.extensions.ui.map((UI, index) => (
            <UI key={index} />
          ))}
          <Debug />
        </PannableArea>

        <WorkspaceCursor />
        <Rulers />

        <div className="absolute inset-0 w-full h-full" />
      </DropLayer>
    </AppProvider>
  );
}