import { Box } from "@kitly/elements/src/element-highlighter/free-transform/box";
import { applyZoomToPoints } from "@kitly/system";

import { useApp } from "../../app-provider";

export function Wireframes() {
  const app = useApp();
  const zoom = app.useWorkspaceStore((state) => state.zoom);

  const points = app.useElementsStore((state) =>
    state.ids.map((id) =>
      applyZoomToPoints(state.transformations[id].points, zoom)
    )
  );

  return (
    <>
      {points.map((points, index) => (
        <Box stroke="#fff"  strokeDasharray={"4"} key={index} points={points} />
      ))}
    </>
  );
}
