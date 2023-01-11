import { useApp } from "../../app-provider";

export function GroupInfo() {
  const app = useApp();
  const selection = app.useElementsStore(
    (state) => state.selectionTransformations
  );

  const elements = app.useElementsStore((state) =>
    [
      // state.selected
      "group",
      "groupx",
      "group-image3",
    ].map((id) => state.transformations[id]).filter(Boolean)
  );

  const pan = app.useWorkspaceStore((state) => state.pan);

  if (!selection) {
    return null;
  }
  return (
    <div
      style={{
        left: -pan[0] + 40,
        bottom: pan[1] + 20,
      }}
      className="fixed  bg-zinc-700 p-2 rounded text-sm w-fit text-white"
    >
      <div>
        {selection.id}: <b>{selection.worldPosition[0].toFixed(2)}</b>,{" "}
        <b>{selection.worldPosition[1].toFixed(2)}</b>
        <div>
          {selection.rotation.degree}
        </div>
      </div>

      <div>
        {elements.map((element) => (
          <div key={element.id} className="flex space-x-2 items-center">
            <b>{element.id}</b>:
            <div className="space-x-1 bg-zinc-800 text-xs px-1 rounded">
              <span>{element.worldPosition[0]}</span>
              <span>/</span>
              <span>{element.worldPosition[1]}</span>
            </div>
            <div className="space-x-1 bg-zinc-800 text-xs px-1 rounded">
              <span>{element.x}</span>
              <span>/</span>
              <span>{element.y}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
