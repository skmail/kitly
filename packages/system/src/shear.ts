import { Mat } from "@free-transform/core";

export function shear(shx: number, shy: number) {
  const ident = Mat.identity();

  ident[0][1] = shx;
  ident[1][0] = shy;

  return ident;
}
