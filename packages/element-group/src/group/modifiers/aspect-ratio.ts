import { App } from "@kitly/system";

export function aspectRatio(app: App) {
  const selected = app.useElementsStore.getState().selected;
  if (selected.length === 0) {
    return;
  }
  return (
    selected.length > 1 ||
    selected.some(
      (id) => app.useElementsStore.getState().elements[id]?.type === "group"
    )
  );
}
