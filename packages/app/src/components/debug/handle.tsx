import { Point } from "@kitly/system";
import { useApp } from "../../app-provider";

import { getShapePoints, handles } from "@kitly/system";

export function HandleDebug() {
  const app = useApp();

  const [pan, zoom] = app.useWorkspaceStore((state) => [state.pan, state.zoom]);
  const handleslist = app.useElementsStore((state) => {
    if (!state.selected) {
      return;
    }

    const transformations = state.selectionTransformations.transformations;

    const result: Point[] = [];

    if (!transformations) {
      return result;
    }
    for (let handle of handles) {
      result.push(
        ...getShapePoints({
          handle,
          transformations,
          zoom,
        })
      );
    }

    return result;
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
            background: "red",
          }}
          key={index}
        />
      ))}
    </>
  );
}
