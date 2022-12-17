import RBush from "rbush";
import {
  SpatialElement,
  SpatialTree as SpatialTreeType,
} from "./types/spatial-tree";

export class SpatialTree
  extends RBush<SpatialElement>
  implements SpatialTreeType<SpatialElement> {}
