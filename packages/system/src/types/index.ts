import { FC } from "react";
import { Matrix, Point, Tuple } from "@free-transform/core";
import { App, Extension, Raycastable } from "./app";

export const MouseButton = {
  NONE: 0,
  LEFT: 1,
  RIGHT: 2,
} as const;

export type MouseButtonType = typeof MouseButton[keyof typeof MouseButton];

export type WrapPoints = Tuple<Point, 4>;

export type TransformMode = "scale" | "translate" | "rotate" | "warp";

export interface Table<T> {
  ids: string[];
  items: Record<string, T>;
}

export type ElementTransformationDetails = {
  id: string;
  x: number;
  y: number;

  baseWidth: number;
  baseHeight: number;

  scale: { sx: number; sy: number };
  rotation: { angle: number; wraped: number; degree: number };
  translation: { tx: number; ty: number };
  affineMatrix: Matrix;
  invertedAffineMatrix: Matrix;
  perspectiveMatrix: Matrix;
  relativeMatrix: Matrix; // affine + perspective
  absoluteMatrix: Matrix; // affine + perspective + translate matrix(x, y)
  warp: WrapPoints;
  width: number;
  height: number;
  disabledScale?: boolean;
  bounds: {
    width: number;
    height: number;
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
  points: Point[];
};

export interface Element<T = string> {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  warp?: Tuple<[number, number], 4>;
  matrix: Matrix;
  disabledScale?: boolean;
  type: T;
  [key: string]: any;
  children?: any[];
}

export type HandleProps = {
  size: number;
  point: Point;
  offset: Point;
  type: "scale" | "rotate" | "warp";
};

export type OnElementUpdate = (id: string, payload: Partial<Element>) => void;
