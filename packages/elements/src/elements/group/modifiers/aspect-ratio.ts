import { App } from "@kitly/system";

export function aspectRatio(selected: string[], app: App) {
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
