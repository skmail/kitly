import shallow from "zustand/shallow";
import { ComponentProps, Fragment, memo } from "react";
import classNames from "classnames";
import {
  ElementTransformationDetails,
  HandleProps,
  Point,
} from "@kitly/system";
import { useApp } from "@kitly/app";
import { shallowEqual } from "@kitly/system";
import { FreeTransform } from "./free-transform";
import { Grid } from "./free-transform/grid";
import { Handle } from "./free-transform/handle";

const getHandle = (
  type: HandleProps["type"],
  point: Point,
  offset = 0,
  size = 12
): HandleProps => {
  return {
    type,
    size,
    point: point,
    offset: [
      (offset * (point[0] - 0.5)) / 0.5,
      (offset * (point[1] - 0.5)) / 0.5,
    ],
  };
};

export const handles = (
  [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
    [0.5, 0],
    [1, 0.5],
    [0, 0.5],
    [0.5, 1],
  ] as Point[]
).reduce<HandleProps[]>((acc, position) => {
  acc.push(getHandle("scale", position));
  acc.push(getHandle("rotate", position, 14, 20));
  return acc;
}, []);

const scaleHandles = handles.filter(
  (handle) =>
    handle.type === "scale" && handle.point[0] != 0.5 && handle.point[1] != 0.5
);

interface Props {
  transformations: ElementTransformationDetails;
  offset?: [number, number];

  allowChanges?: boolean;
}

function _FreeTransformElement({
  transformations,
  offset = [0, 0],
  children,
  allowChanges = true,
  className,
  ...rest
}: Props & ComponentProps<"div">) {

  const app = useApp();

  const [zoom, animateZoom] = app.useWorkspaceStore(
    (state) => [state.zoom, state.animateZoom],
    shallowEqual
  );

  return (
    <FreeTransform
      {...rest}
      transformations={transformations}
      className={classNames(
        "transition",
        "focus:outline-none",
        animateZoom && "opacity-0",
        className
      )}
      zoom={zoom}
    >
      {children}
      {!children && (
        <>
          <Grid strokeWidth={1} stroke="#2563eb" lines={0} />

          {scaleHandles.map((handle, index) => (
            <Fragment key={index}>
              <Handle
                key={`scale-${index}`}
                position={handle.point}
                style={{
                  width: handle.size,
                  height: handle.size,
                  marginLeft: -handle.size / 2,
                  marginTop: -handle.size / 2,
                }}
                className={classNames(
                  "transition-opacity border absolute rounded-sm border-sky-600 bg-white cursor-pointer"
                )}
                offset={handle.offset}
                type={"scale"}
              />
            </Fragment>
          ))}
        </>
      )}
    </FreeTransform>
  );
}


export const FreeTransformElement = memo(_FreeTransformElement)
