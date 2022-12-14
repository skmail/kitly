import { useApp } from "../../app-provider";
import { Ruler } from "./Ruler";

export function Rulers() {
  const app = useApp();

  const { zoom, pan, rulers, size } = app.useWorkspaceStore(
    ({ zoom, pan, rulers, size }) => ({
      zoom,
      pan,
      rulers,
      size,
    })
  );

  const box = 20;

  if (!rulers.horizontal && !rulers.vertical) {
    return null;
  }
  return (
    <>
      {rulers.vertical && (
        <Ruler
          size={size[1]}
          position={pan[1]}
          direction="vertical"
          zoom={zoom}
          box={box}
          gap={rulers.vertical && rulers.horizontal}
        />
      )}
      {rulers.horizontal && (
        <Ruler
          size={size[0]}
          position={pan[0]}
          direction="horizontal"
          zoom={zoom}
          box={box}
          gap={rulers.vertical && rulers.horizontal}
        />
      )}
      {rulers.vertical && rulers.horizontal && (
        <div
          className="absolute bg-zinc-800 border-r border-b border-zinc-700 left-0 top-0"
          style={{
            height: box,
            width: box,
          }}
        ></div>
      )}
    </>
  );
}
