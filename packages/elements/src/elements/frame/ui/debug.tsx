import { useApp } from "@kitly/app";
import { Point, shallowEqual, Angle, Vec } from "@kitly/system";
import { useMemo } from "react";
import { Box } from "../../../element-highlighter/free-transform/box";
import { FrameTitleUtils } from "../frame-title-utils";
import { getTitleInfo } from "./get-title-info";

const DebugElement = ({ id }: { id: string }) => {
  const app = useApp();
  const state = app.useElementsStore((state) => {
    const transformation = state.transformations[id];
    const bounds = transformation.bounds;
    const info = getTitleInfo(transformation);

    return {
      info,
      angle: info.angle,
      offset: info.offset,
      points: transformation.points,
      fullBounds: [
        [bounds.xmin, bounds.ymin],
        [bounds.xmin + bounds.width, bounds.ymin],
        [bounds.xmin + bounds.width, bounds.ymin + bounds.height],
        [bounds.xmin, bounds.ymin + bounds.height],
      ] as Point[],
      bounds: [
        [
          [bounds.xmin, bounds.ymin],
          [bounds.xmin + bounds.width / 2, bounds.ymin],
          [bounds.xmin + bounds.width / 2, bounds.ymin + bounds.height / 2],
          [bounds.xmin, bounds.ymin + bounds.height / 2],
        ],
        [
          [bounds.xmin + bounds.width / 2, bounds.ymin],
          [bounds.xmin + bounds.width, bounds.ymin],
          [bounds.xmin + bounds.width, bounds.ymin + bounds.height / 2],
          [bounds.xmin + bounds.width / 2, bounds.ymin + bounds.height / 2],
        ],
        [
          [bounds.xmin, bounds.ymin + bounds.height / 2],
          [bounds.xmin + bounds.width / 2, bounds.ymin + bounds.height / 2],
          [bounds.xmin + bounds.width / 2, bounds.ymin + bounds.height],
          [bounds.xmin, bounds.ymin + bounds.height],
        ],
        [
          [bounds.xmin + bounds.width / 2, bounds.ymin + bounds.height / 2],
          [bounds.xmin + bounds.width, bounds.ymin + bounds.height / 2],
          [bounds.xmin + bounds.width, bounds.ymin + bounds.height],
          [bounds.xmin + bounds.width / 2, bounds.ymin + bounds.height],
        ],
      ] as Point[][],
    };
  }, shallowEqual);

  const zoom = app.useWorkspaceStore((state) => state.zoom);
  const points = useMemo(
    () => state.points.map((point) => Vec.multiplyScalar(point, zoom)),
    [state.points, zoom]
  );

  const fullBounds = useMemo(
    () => state.fullBounds.map((point) => Vec.multiplyScalar(point, zoom)),
    [state.fullBounds, zoom]
  );

  const bounds = useMemo(
    () =>
      state.bounds.map((points) =>
        points.map((point) => Vec.multiplyScalar(point, zoom))
      ),
    [state.bounds, zoom]
  );

  const titlePoints = useMemo(() => {
    return FrameTitleUtils.points(state.info, zoom);
  }, [state.info, zoom]);

  const staticTitlePoints = useMemo(() => {
    return FrameTitleUtils.points(state.info);
  }, [state.info]);

  const pan = app.useWorkspaceStore((state) => state.pan);

  const mouse = app.useMouseStore(
    (state) => [state.mouse, Vec.multiply(state.mouse, [1, 1])],
    shallowEqual
  );
  return (
    <>
      {/* <Box points={points} />
      <Box points={fullBounds} />
      {bounds.map((bound, index) => (
        <Box points={bound} key={index} />
      ))}

      {points.map((point, index) => {
        return (
          <div
            style={{
              transform: `translate(${point[0]}px, ${point[1]}px)`,
            }}
            key={index}
            className="absolute p-0.5 rounded mt-2 bg-zinc-900 w-fit left-0 top-0 h-1 flex text-xs text-white  h-fit"
          >
            [{index}] {`${handles[index][0]}, ${handles[index][1]}`}
          </div>
        );
      })}

      {points.map((point, index) => {
        return (
          <div
            style={{
              transform: `translate(${point[0]}px, ${point[1]}px)`,
            }}
            key={index}
            className="absolute p-0.5 rounded mt-2 bg-zinc-900 w-fit left-0 top-0 h-1 flex text-xs text-white  h-fit"
          >
            [{index}] {`${handles[index][0]}, ${handles[index][1]}`}
          </div>
        );
      })} */}

      {titlePoints.map((point, index) => {
        return (
          <div
            style={{
              transformOrigin: "0 0",
              transform: `translate(${point[0]}px, ${
                point[1]
              }px) rotate(${Angle.degrees(state.angle)}deg)`,
            }}
            key={index}
            className="absolute  left-0 top-0 h-1 w-0.5 h-1 h-0.5  bg-red-500"
          />
        );
      })}

      <div
        style={{
          left: -pan[0] + 40,
          bottom: pan[1] + 20,
        }}
        className="fixed  bg-zinc-700 p-2 rounded text-sm w-fit text-white"
      >
        <div>
          IFRAME TITLE: {staticTitlePoints[0][0].toFixed(2)}x
          {staticTitlePoints[0][1].toFixed(2)}
        </div>

        <div>
          MOUSE: {mouse[0][0].toFixed(2)} x {mouse[0][1].toFixed(2)}
        </div>
        <div>
          MOUSE_Z: {mouse[1][0].toFixed(2)} x {mouse[1][1].toFixed(2)}
        </div>
      </div>
    </>
  );
};
export function Debug() {
  const app = useApp();
  const ids = app.useElementsStore(
    (state) => state.ids.filter((id) => state.elements[id].id === "frame"),
    shallowEqual
  );

  return (
    <>
      {ids.map((id) => (
        <DebugElement key={id} id={id} />
      ))}
    </>
  );
}
