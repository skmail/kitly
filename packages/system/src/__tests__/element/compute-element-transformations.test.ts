import { identity } from "@free-transform/core";
import { computeElementTransformations } from "../../element/compute-element-transformations";

describe("compute", () => {
  it("test", () => {
    const result = computeElementTransformations({
      id: "",
      type: "any",
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      matrix: identity()
    });
    expect(result.worldPosition).toEqual([0, 0]);
  });


  it("test", () => {
    const result = computeElementTransformations({
      id: "",
      type: "any",
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      matrix: identity()
    });
    expect(result.worldPosition).toEqual([0, 0]);
  });
});

export {};
