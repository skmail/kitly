import RBush from "rbush";
import {
  SpatialElement,
  SpatialTree as SpatialTreeType,
} from "./types/spatial-tree";

export * from "./types/spatial-tree";
export class SpatialTree
  extends RBush<SpatialElement>
  implements SpatialTreeType<SpatialElement>
{
  update(
    elements: SpatialElement | SpatialElement[],
    old: SpatialElement | SpatialElement[]
  ) {
    if (!Array.isArray(elements)) {
      elements = [elements];
    }

    if (!Array.isArray(old)) {
      old = [old];
    }

    old.forEach((element) =>
      this.remove(element, (a, b) => {
        return a.id === b.id && a.type === b.type;
      })
    );
    
    this.load(elements);
  }
}
