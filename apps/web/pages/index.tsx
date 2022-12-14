import { App } from "@kitly/app";
import { createApp } from "@kitly/create-app";

const app = createApp();

app.useElementsStore.getState().addMany([
  {
    id: "laptop",
    x: 0,
    y: 0,
    matrix: [
      [1, 0, 0, 5],
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
  },
]);
export default function Web() {
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
