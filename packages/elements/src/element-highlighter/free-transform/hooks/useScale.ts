import {
  scale,
  Point,
  Matrix,
  call,
  Event,
  ScaleUpdatePayload,
  EventValidator,
} from "@free-transform/core";
import { AnyEventPayload } from "../types";
import { useDrag } from "./useDrag";

interface Props {
  width: number;
  height: number;

  matrix: Matrix;
  affineMatrix: Matrix;
  perspectiveMatrix: Matrix;

  onStart?: (event: Event) => void;
  onMove?: (event: Event) => void;
  onEnd?: (event: Event) => void;

  onAnyStart?: (type: AnyEventPayload, event: Event) => void;
  onAnyEnd?: (type: AnyEventPayload, event: Event) => void;

  onUpdate?: (data: ScaleUpdatePayload) => void;

  fromCenter: EventValidator<Event>;
  aspectRatio: EventValidator<Event>;
  scaleLimit: [number, number];
}

export function useScale({
  width,
  height,
  matrix,
  affineMatrix,
  perspectiveMatrix,

  fromCenter,
  aspectRatio,
  scaleLimit,

  onStart,
  onMove,
  onEnd,

  onAnyStart,
  onAnyEnd,

  onUpdate,
}: Props) {
  const onDrag = useDrag();

  return (handle: Point, event: PointerEvent) => {
    call(onStart, event);
    call(
      onAnyStart,
      {
        type: "scale",
        handle,
      },
      event
    );

    // event.stopPropagation();
    event.preventDefault();

    const drag = scale(
      handle,
      {
        start: [event.clientX, event.clientY],

        width,
        height,
        matrix,
        affineMatrix,
        perspectiveMatrix,

        aspectRatio,
        fromCenter,

        scaleLimit,
      },
      (payload) => {
        call(onUpdate, payload);
        call(onMove);
      }
    );

    onDrag(drag, () => {
      call(onEnd, event);
      call(
        onAnyEnd,
        {
          type: "scale",
          handle,
        },
        event
      );
    });
  };
}
