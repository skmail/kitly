import { useRotate } from "./hooks/useRotate";
import { useScale } from "./hooks/useScale";
import { useWarp } from "./hooks/useWarp";
import { useTranslate } from "./hooks/useTranslate";

import {
  Matrix,
  Point,
  Tuple,
  Event,
  EventValidator,
  identity,
  multiply,
  matrixRotate,
  matrixTranslate,
  matrixScale,
} from "@free-transform/core";
import { useValues } from "./hooks/useValues";

import {
  ComponentProps,
  createContext,
  useContext,
  useMemo,
  useRef,
} from "react";
import { AnyEventPayload } from "./types";
import { ElementTransformationDetails } from "@kitly/system";

type EventListeners<
  T extends string,
  B extends string = "Start" | "" | "End",
  P = any
> = {
  [K in `on${T}${B}`]?: (payload: P) => void;
};

type Props = {
  offset?: Point;
  pan?: Point;
  zoom?: number;
  transformations: ElementTransformationDetails;
  className?: string;
};

type ContextValues = {
  pan: Point;
  zoom: number;
  transformations: ElementTransformationDetails;
  offset: Point;
};

const Context = createContext<ContextValues>({
  transformations: {} as ElementTransformationDetails,
  pan: [0, 0],
  offset: [0, 0],
  zoom: 1,
});

export const useFreeTransform = () => useContext(Context);

export function FreeTransform({
  transformations,
  pan = [0, 0],
  zoom = 1,
  offset = [0, 0],
  ...rest
}: ComponentProps<"div"> & Props) {
  const ref = useRef<HTMLDivElement>(null);

  transformations = useMemo(() => {
    let relativeMatrix: Matrix = multiply(
      matrixScale(zoom, zoom),
      transformations.relativeMatrix
    );
    const absoluteMatrix = multiply(
      matrixTranslate(transformations.x * zoom, transformations.y * zoom),
      relativeMatrix
    );

    return {
      ...transformations,
      relativeMatrix,
      absoluteMatrix,
    };
  }, [zoom, transformations]);
  return (
    <Context.Provider
      value={{
        transformations,
        offset,
        zoom,
        pan,
      }}
    >
      <div
        {...rest}
        style={{ position: "absolute", left: 0, top: 0 }}
        ref={ref}
      />
    </Context.Provider>
  );
}
