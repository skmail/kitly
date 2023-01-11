import { Angle, makeWarpPoints, Vec } from "@kitly/system";
import { getTitleInfo } from "./ui/get-title-info";

export const FrameTitleUtils = {
  info: getTitleInfo,
  points: (info: ReturnType<typeof getTitleInfo>, zoom = 1) =>
    makeWarpPoints(info.width * zoom, 20).map((point) =>
      Vec.add(
        Angle.point(point, -info.angle),
        Vec.add(Vec.multiplyScalar(info.position, zoom), [0, -18])
      )
    ),
};
