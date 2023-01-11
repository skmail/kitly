import { App, Collision, Vec } from "@kitly/system";
import { FrameTitleUtils } from "../frame-title-utils";

export function raycast(app: App) {
  const state = app.useElementsStore.getState();
  const zoom = app.useWorkspaceStore.getState().zoom;
  const mouse = app.useMouseStore.getState().mouse;
  const mouseZoomed = Vec.multiply(mouse, [zoom, zoom]);
  const offset = 1;

  const search = {
    minX: mouse[0] - offset,
    minY: mouse[1] - offset,
    maxX: mouse[0] + offset,
    maxY: mouse[1] + offset,
  };
  const results = state.spatialTree.search(search);

  const rays: any = [];

  for (let result of results) {
    if (result.type !== "frame-title") {
      continue;
    }

    const transformations = state.transformations[result.id];

    const points = FrameTitleUtils.points(
      FrameTitleUtils.info(transformations),
      zoom
    );
    // console.log(
    //   mouseZoomed, points
    // )

    if (Collision.points([mouseZoomed], points)) {
      rays.push({
        type: "frame-title",
        id: result.id,
      });
    }
  }

  return rays;
}
