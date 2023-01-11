import { PropsWithChildren } from "react";
import { App, shallowEqual } from "@kitly/system";
import { AppProvider, useApp } from "./app-provider";
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
import { LeftSide } from "./components/left-side";

export function App({ app }: PropsWithChildren<{ app: App }>) {
  if (!app) {
    throw new Error("app is not configured");
  }

  const roots = app.useElementsStore((state) => state.ids, shallowEqual);

  return (
    <AppProvider app={app}>
      <div>
        <div className="flex h-screen">
          <LeftSide />
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
              <PannableArea component="svg">
                <ZoomableArea>
                  <ElementsRenderer ids={roots} />
                </ZoomableArea>
              </PannableArea>
            </Frame>

            <PannableArea>
              {app.extensions.ui.pannable.map((UI, index) => (
                <UI key={index} />
              ))}
              <Debug />
            </PannableArea>

            <WorkspaceCursor />
            <Rulers />

            {app.extensions.ui.static.map((UI, index) => (
              <UI key={index} />
            ))}

            <div className="absolute inset-0 w-full h-full" />
          </DropLayer>
        </div>
      </div>
    </AppProvider>
  );
}
