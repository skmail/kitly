import { App, Extension } from "@kitly/system";
import { Renderer } from "./renderer";
import { Watcher } from "./watcher";

export const group: Extension = {
  ui: Watcher,
  elements: [
    {
      name: "group",
      // @todo fix the typing later
      // @ts-ignore
      renderer: Renderer,
      toString: () => "group string for now",
      transformRenderrer: false,
    },
  ],

  modifiers: {
    elements: {
      update: [
        {
          priorty: Infinity,
          modifier: (selected, changes, app: App) => {
            app.useElementsStore.getState().update(selected, changes);
          },
        },
      ],
    },
  },
};
