import { useApp } from "@kitly/app";
import { usePrevious } from "@kitly/app/src/hooks/usePrevious";
import { Raycastable, shallowEqual, toDegree, Vec } from "@kitly/system";
import { useEffect, useMemo, useRef, useState } from "react";
import { FrameTitleUtils } from "../frame-title-utils";
import { FrameTitleRaycastResult } from "../types";

const isFrameTitleRay = (ray: Raycastable): ray is FrameTitleRaycastResult =>
  ray.type === "frame-title";

const Title = ({ id }: { id: string }) => {
  const app = useApp();
  const ray = app.useRaycastStore((state) => state.rays[0], shallowEqual);
  const prevRay = usePrevious(ray);

  const element = app.useElementsStore((state) => {
    const transformations = state.transformations[id];
    const info = FrameTitleUtils.info(transformations);
    return {
      title: state.elements[id].id,
      position: info.position,
      width: info.width,
      offset: info.offset,
      rotation: toDegree(info.angle),
      isActive: state.hovered === id || state.selected.includes(id),
    };
  }, shallowEqual);

  const ref = useRef<HTMLDivElement>(null);
  const zoom = app.useWorkspaceStore((state) => state.zoom, shallowEqual);

  const [maxWidth, setMaxWidth] = useState(0);
  const titleWidth = useMemo(
    () => Math.min(zoom * element.width, maxWidth),
    [zoom, element.width, maxWidth]
  );
  const position = useMemo(() => {
    return Vec.add(Vec.multiplyScalar(element.position, zoom), element.offset);
  }, [element.position, element.offset, zoom]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    setMaxWidth(ref.current.clientWidth);
  }, []);

  useEffect(() => {
    if (prevRay && isFrameTitleRay(prevRay)) {
      app.useElementsStore.getState().hover();
      return;
    }
    if (!ray || !isFrameTitleRay(ray)) {
      return;
    }
    app.useElementsStore.getState().hover(ray.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.useElementsStore, ray]);

  const isDown = app.useMouseStore((state) => state.isDown, shallowEqual);
  useEffect(() => {
    if (!isDown || !ray || !isFrameTitleRay(ray)) {
      return;
    }
    app.useElementsStore.getState().select([ray.id]);
  }, [app.useElementsStore, isDown, ray]);

  return (
    <div
      ref={ref}
      style={{
        transformOrigin: "0 0",
        transform: `translate(${position[0]}px, ${position[1]}px) rotate(${element.rotation}deg)`,
        maxWidth: maxWidth === 0 ? undefined : titleWidth,
      }}
      className={`absolute left-0 top-0 h-[20px] ${element.isActive ? 'text-blue-400' : 'text-zinc-500'} text-xs truncate ... w-fit`}
    >
      {element.title}
    </div>
  );
};

export function FramesTitle() {
  const app = useApp();
  const ids = app.useElementsStore(
    (state) => state.ids.filter((id) => state.elements[id].type === "frame"),
    shallowEqual
  );

  return (
    <>
      {ids.map((id) => (
        <Title key={id} id={id} />
      ))}
    </>
  );
}
