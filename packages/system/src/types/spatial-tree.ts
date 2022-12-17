type SpatialPoint = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export interface SpatialElement extends SpatialPoint {
  id: string;
}

export type SpatialTree<T> = {
  insert(point: T): void;
  remove(point: T, equals: (a: T, b: T) => boolean): void;
  search(point: SpatialPoint): T[];
};
