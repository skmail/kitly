import { Point } from "@free-transform/core";
import { shallowEqual } from "@kitly/system";
import classNames from "classnames";
import { useApp } from "../../app-provider";

function Layer({ id, depth = 1 }: { id: string; depth?: number }) {
  const app = useApp();

  const layer = app.useElementsStore(
    (state) => ({
      type: state.elements[id].type,
      name: state.elements[id].id,
      isSelected: state.selected.includes(id),
      isHovered: state.hovered === id,
      children: state.elements[id].children,
    }),
    shallowEqual
  );

  const Icon = app.extensions.elements.get(layer.type)?.icon || "div";

  return (
    <>
      <button
        className={classNames(
          "flex items-center w-full p-2 text-xs pl-4 text-white",
          "border border-transparent hover:border-sky-600",
          layer.isSelected && "bg-sky-600 bg-opacity-30",
          !layer.isSelected && layer.isHovered && " border-orange-300"
        )}
        style={{
          paddingLeft: 14 * depth,
        }}
        onMouseEnter={() => {
          app.useElementsStore.getState().hover(id);
        }}
        onMouseLeave={() => {
          app.useElementsStore.getState().hover();
        }}
        onClick={() => {
          app.useElementsStore.getState().select([id]);

          const transformations =
            app.useElementsStore.getState().transformations[id];

          const bounds = transformations.bounds;
          const size = app.useWorkspaceStore.getState().size;

          let scale =
            Math.min(size[0] / bounds.width, size[1] / bounds.height) * 0.5;
 
          const panTo: Point = [
            -bounds.xmin * scale + (size[0] / 2 - (bounds.width * scale) / 2),
            -bounds.ymin * scale + (size[1] / 2 - (bounds.height * scale) / 2),
          ];

          app.useWorkspaceStore.getState().setZoom(scale, panTo);
        }}
      >
        <div className="w-4 h-4 flex items-center justify-center bg-opacity-50  mr-2 text-white">
          <Icon className="w-3 h-3" />
        </div>
        {layer.name}
      </button>
      {layer.children && layer.children?.length > 0 && (
        <div
          className={classNames({
            "bg-sky-600 bg-opacity-10": layer.isSelected,
          })}
        >
          {layer.children?.map((id) => (
            <Layer id={id} key={id} depth={depth + 1} />
          ))}
        </div>
      )}
    </>
  );
}
export function Layers() {
  const app = useApp();
  const ids = app.useElementsStore((state) => state.ids, shallowEqual);
  return (
    <div>
      {ids.map((id) => (
        <Layer key={id} id={id} />
      ))}
    </div>
  );
}
