import { App } from "@kitly/app";
import { createApp } from "@kitly/create-app";
import { fitFrameTreeContents, fitGroupTree } from "@kitly/elements";
import { Element, identity } from "@kitly/system";
import { useEffect, useMemo } from "react";

const thousand: Element[] = [];
const total = 40;
const perRow = 20;

const margin = 40;
const size = [300, 300];
for (let i = 0; i < total; i++) {
  const x = (i % perRow) * (size[0] + margin);
  const y = Math.floor(i / perRow) * (size[1] + margin);

  thousand.push({
    id: "chair" + `${i}`,
    x,
    y,
    matrix: [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ],
    width: size[0],
    height: size[1],
    type: "image",
    src: "https://plus.unsplash.com/premium_photo-1670691965221-4ad654207264?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80",
  });
}

export default function Web() {
  const app = useMemo(() => createApp(), []);
  useEffect(() => {
    app.elements.addFromTree([
      // ...thousand,
      fitFrameTreeContents({
        id: "frame",
        x: 0,
        y: 0,
        disabledScale: true,
        matrix: [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1],
        ],
        width: 600,
        height: 600,
        type: "frame",
        children: [
          {
            id: "laptop-frame",
            x: 500,
            y: 15,
            matrix: [
              [1, 0, 0, 0],
              [0, 1, 0, 0],
              [0, 0, 1, 0],
              [0, 0, 0, 1],
            ],
            width: 300,
            height: 300,
            type: "image",
            src: "https://images.unsplash.com/photo-1664574654578-d5a6a4f447bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
          },
          {
            id: "laptop",
            x: 0,
            y: 0,
            matrix: [
              [1, 0, 0, 0],
              [0, 1, 0, 0],
              [0, 0, 1, 0],
              [0, 0, 0, 1],
            ],
            width: 300,
            height: 300,
            type: "image",
            src: "https://images.unsplash.com/photo-1664574654578-d5a6a4f447bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
          },

          {
            id: "chair",
            x: 350,
            y: 350,
            matrix: [
              [1, 0, 0, 0],
              [0, 1, 0, 0],
              [0, 0, 1, 0],
              [0, 0, 0, 1],
            ],
            width: 300,
            height: 300,
            type: "image",
            src: "https://plus.unsplash.com/premium_photo-1670691965221-4ad654207264?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80",
          },
          {
            id: "text",
            x: 40,
            y: 40,
            matrix: [
              [1, 0, 0, 0],
              [0, 1, 0, 0],
              [0, 0, 1, 0],
              [0, 0, 0, 1],
            ],
            width: 100,
            height: 100,
            type: "text",
            text: "Welcome ...",
            disabledScale: true,
          },

        ],
      }),

      fitGroupTree({
        id: "group",
        x: 0,
        y: 0,
        matrix: [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1],
        ],
        width: 600,
        height: 600,
        type: "group",
        children: [
          {
            id: "groupx",
            x: 0,
            y: 0,
            matrix: [
              [1, 0, 0, 0],
              [0, 1, 0, 0],
              [0, 0, 1, 0],
              [0, 0, 0, 1],
            ],
            width: 600,
            height: 600,
            type: "group",
            children: [
              {
                id: "group-text2",
                x: 800,
                y: 800,
                matrix: identity(),
                width: 140,
                height: 40,
                type: "text",
                text: "Hello from group two",
              },

              {
                id: "group-image3",
                x: 700,
                y: 700,
                matrix: identity(),
                width: 100,
                height: 100,
                type: "image",
                src: "https://plus.unsplash.com/premium_photo-1664547606558-33c44a434b5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80",
              },
            ],
          },
          {
            id: "group-text",
            x: 0,
            y: 0,
            // disabledScale: true,
            matrix: [
              [1, 0, 0, 0],
              [0, 1, 0, 0],
              [0, 0, 1, 0],
              [0, 0, 0, 1],
            ],
            width: 100,
            height: 100,
            type: "text",
            text: "I'm group text ...",
            disabledScale: true,
          },
          {
            id: "group-image",
            x: 300,
            y: 300,
            matrix: [
              [1, 0, 0, 0],
              [0, 1, 0, 0],
              [0, 0, 1, 0],
              [0, 0, 0, 1],
            ],
            width: 300,
            height: 300,
            type: "image",
            src: "https://plus.unsplash.com/premium_photo-1664547606558-33c44a434b5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80",
          },
        ],
      }),
    ]);
  }, [app]);
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <App app={app} />
    </div>
  );
}
