type SpatialPoint = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export interface SpatialElement extends SpatialPoint {
  id: string;
  type: string;
}

export type SpatialTree<T> = {
  load(point: T[]): void;
  insert(point: T): void;
  update(point: T, old: T): void;
  update(points: T[], old: T[]): void;
  remove(point: T, equals: (a: T, b: T) => boolean): void;
  search(point: SpatialPoint): T[];
};
