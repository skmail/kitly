import { identity } from "@kitly/system";
import { fitGroupTree } from "../../../../elements/group/utils";

describe("fit group tree", () => {
  it("fit group tree", () => {
    const result = fitGroupTree({
      id: "group",
      x: 400,
      y: 400,
      matrix: identity(),
      width: 600,
      height: 600,
      type: "group",
      children: [
        {
          id: "text",
          x: 100,
          y: 100,
          matrix: identity(),
          width: 100,
          height: 100,
          type: "text",
          text: "[text]",
          disabledScale: true,
        },
        {
          id: "image",
          x: 400,
          y: 400,
          width: 200,
          height: 200,
          matrix: identity(),
          type: "image",
          src: "[url]",
        },
      ],
    });
    expect(result.x).toEqual(100)
    expect(result.children?.[0]?.x).toEqual(0)
  });

  it("fit nested group tree", () => {
    const result = fitGroupTree({
      id: "group",
      x: 400,
      y: 400,
      matrix: identity(),
      width: 600,
      height: 600,
      type: "group",
      children: [
        {
          id: "text",
          x: 100,
          y: 100,
          matrix: identity(),
          width: 100,
          height: 100,
          type: "text",
          text: "[text]",
          disabledScale: true,
        },
        {
          id: "image",
          x: 400,
          y: 400,
          width: 200,
          height: 200,
          matrix: identity(),
          type: "image",
          src: "[url]",
        },
      ],
    });
    expect(result.x).toEqual(100)
    expect(result.children?.[0]?.x).toEqual(0)
  });
});

export {};
