import { App, RaycastPost } from "@kitly/system";
import { isElementRay } from "../../../utils";

export const post: RaycastPost = (rays, app: App) => {
  if (!rays.length || !isElementRay(rays[0])) {
    return;
  }

  const elements = app.useElementsStore.getState().elements;

  if (
    elements[rays[0].id].type === "frame" &&
    elements[rays[0].id].children?.length &&
    !elements[rays[0].id].parentId
  ) {
    return [];
  }
};
