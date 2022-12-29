import { Point } from "@kitly/system";
import { applyOffsetToPoints } from "@kitly/system/src/utils/point/apply-offset";
import { applyZoomToPoints } from "@kitly/system/src/utils/point/apply-zoom";
import { useApp } from "../../app-provider";

export function ShapeDebug() {
  const app = useApp();

  const [pan, zoom] = app.useWorkspaceStore((state) => [state.pan, state.zoom]);
  const handleslist = app.useElementsStore((state) => {
    if (!state.selected) {
      return;
    }

    const transformation = state.selectionTransformations;

    if (!transformation) {
      return [] as Point[];
    }

    return applyZoomToPoints(transformation.points, zoom);
  });

  return (
    <>
      {handleslist?.map((handle, index) => (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: `translate(${handle[0]}px, ${handle[1]}px)`,

            width: 4,
            height: 4,
            background: index === 24 ? "yellow" : "red",
          }}
          key={index}
        />
      ))}
    </>
  );
}
