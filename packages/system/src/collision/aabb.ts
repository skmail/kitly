import { Point, Tuple } from "@free-transform/core";

export class AABB {
  static coverBox(box: Tuple<Point, 4>, points: Point[]) {
    return ( 
      points.every(
        (point) =>
          point[0] >= box[0][0] &&
          point[1] >= box[0][1] &&
          point[0] <= box[2][0] &&
          point[1] <= box[2][1]
      )
    );
  }
}
