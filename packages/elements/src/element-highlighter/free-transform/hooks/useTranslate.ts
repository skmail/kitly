import {
  translate,
  call,
  Event,
  TranslateUpdatePayload,
} from "@free-transform/core";
import { AnyEventPayload } from "../types";
import { useDrag } from "./useDrag";

interface Props {
  x: number;
  y: number;

  onStart?: (event: Event) => void;
  onMove?: (event: Event) => void;
  onEnd?: (event: Event) => void;

  onAnyStart?: (type: AnyEventPayload, event: Event) => void;
  onAnyEnd?: (type: AnyEventPayload, event: Event) => void;

  onUpdate?: (data: TranslateUpdatePayload) => void;
}

export function useTranslate({
  x,
  y,
  onStart,
  onMove,
  onEnd,

  onAnyStart,
  onAnyEnd,

  onUpdate,
}: Props) {
  const onDrag = useDrag();

  return (event: PointerEvent) => {
    // event.stopPropagation();
    event.preventDefault();

    let isStarted = false;
    const drag = translate(
      {
        start: [event.clientX, event.clientY],
        x,
        y,
      },
      (payload) => {
        if (!isStarted && (payload.x - x > 1 || payload.y - y > 1)) {
          call(onStart, event);
          call(
            onAnyStart,
            {
              type: "translate",
            },
            event
          );
          isStarted = true;
        }

        call(onMove);
        call(onUpdate, payload);
      }
    );

    onDrag(drag, () => {
      call(onEnd, event);
      call(
        onAnyEnd,
        {
          type: "translate",
        },
        event
      );
    });
  };
}
