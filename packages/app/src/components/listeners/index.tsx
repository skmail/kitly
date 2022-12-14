import { DeleteListener } from "./delete-listener";
import KeyboardListener from "./keyboard-listener";
import { MouseListener } from "./mouse-listener";
import { RaycastListener } from "./raycast-listener";
import { WorkspaceResizeListener } from "./workspace-resize-listener";
import { ZoomListener } from "./zoom-listener";

export function Listeners() {
  return (
    <>
      <WorkspaceResizeListener />
      <MouseListener /> 
      <KeyboardListener />
      <DeleteListener />
      <RaycastListener />
      <ZoomListener />
    </>
  );
}
