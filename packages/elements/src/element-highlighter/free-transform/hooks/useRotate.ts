import {
  rotate,
  Point,
  Matrix,
  call,
  Event,
  RotateUpdatePayload,
  EventValidator,
} from "@free-transform/core";
import { AnyEventPayload } from "../types";
import { useDrag } from "./useDrag";

interface Props {
  x: number;
  y: number;

  width: number;
  height: number;

  offset: [number, number];

  matrix: Matrix;
  affineMatrix: Matrix;

  snap: EventValidator<Event>;
  snapDegree: number;

  onStart?: (event: Event) => void;
  onMove?: (event: Event) => void;
  onEnd?: (event: Event) => void;

  onAnyStart?: (payload: AnyEventPayload, event: Event) => void;
  onAnyEnd?: (type: AnyEventPayload, event: Event) => void;

  onUpdate?: (data: RotateUpdatePayload) => void;
}
export function useRotate({
  x,
  y,
  width,
  height,
  offset,
  matrix,
  affineMatrix,
  snap,
  snapDegree,
  onStart,
  onMove,
  onEnd,
  onUpdate,
  onAnyStart,
  onAnyEnd,
}: Props) {
  const onDrag = useDrag();

  return (handle: Point, event: PointerEvent) => {
    call(onStart, event);
    call(
      onAnyStart,
      {
        type: "rotate",
        handle,
      },
      event
    );

    // event.stopPropagation();
    event.preventDefault();

    const drag = rotate(
      handle,
      {
        start: [event.clientX, event.clientY],
        x,
        y,
        width,
        height,
        offset,
        matrix,
        affineMatrix,
        snap,
        snapDegree,
      },
      (payload) => {
        call(onMove);
        call(onUpdate, payload);
      }
    );

    onDrag(drag, () => {
      call(onEnd, event);
      call(
        onAnyEnd,
        {
          type: "rotate",
          handle,
        },
        event
      );
    });
  };
}
