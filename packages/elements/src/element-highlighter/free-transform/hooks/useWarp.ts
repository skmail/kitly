import {
  warp,
  Point,
  Matrix,
  call,
  Event,
  WarpUpdatePayload,
  Tuple,
} from "@free-transform/core";
import { AnyEventPayload } from "../types";
import { useDrag } from "./useDrag";

interface Props {
  handles: Tuple<Point, 4>;

  affineMatrix: Matrix;

  onStart?: (event: Event) => void;
  onMove?: (event: Event) => void;
  onEnd?: (event: Event) => void;

  onAnyStart?: (type: AnyEventPayload, event: Event) => void;
  onAnyEnd?: (type: AnyEventPayload, event: Event) => void;

  onUpdate?: (data: WarpUpdatePayload) => void;
}

export function useWarp({
  handles,
  affineMatrix,
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
        type: "warp",
        handle,
      },
      event
    );

    // event.stopPropagation();
    event.preventDefault();

    const drag = warp(
      handle,
      {
        start: [event.clientX, event.clientY],
        matrix: affineMatrix,
        warp: handles,
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
          type: "warp",
          handle,
        },
        event
      );
    });
  };
}
