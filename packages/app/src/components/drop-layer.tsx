import {
  PropsWithChildren,
  ComponentProps,
  forwardRef,
  RefObject,
} from "react";

import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider, useDrop } from "react-dnd";
import { useApp } from "../app-provider";
import { Element, uniqueId } from "@kitly/system";

const DropLayerInternal = forwardRef<
  HTMLDivElement,
  PropsWithChildren<ComponentProps<"div">>
>(function DropLayerInternal({ children, ...rest }, ref) {
  const app = useApp();

  const [collectedProps, drop] = useDrop(() => ({
    accept: "ITEM",
    drop: (item: Element[], monitor) => {
      const root = app?.dom.workspace;

      if (!root) {
        return;
      }

      const position = {
        x: 0,
        y: 0,
      };

      const mouse = app.useMouseStore.getState().mouse;
      const fallback = { x: 0, y: 0 };
      const sourceOffset = monitor.getSourceClientOffset() || fallback;

      const clientOffset = monitor.getClientOffset() || fallback;

      position.x = mouse[0] - (clientOffset.x - sourceOffset.x);
      position.y = mouse[1] - (clientOffset.y - sourceOffset.y);

      app.useElementsStore.getState().addMany(
        item.map((item) => ({
          ...item,
          id: uniqueId(),
          ...position,
        }))
      );
    },
  }));

  return (
    <div
      {...rest}
      ref={(_ref) => {
        drop(_ref);
        if (typeof ref === "function") {
          ref(_ref);
        } else if (ref) {
          ref.current = _ref;
        }
      }}
    >
      {children}
    </div>
  );
});

export const DropLayer = forwardRef<
  HTMLDivElement,
  PropsWithChildren<ComponentProps<"div">>
>(function DropLayer(props, ref) {
  return (
    <DndProvider backend={HTML5Backend}>
      <DropLayerInternal {...props} ref={ref} />
    </DndProvider>
  );
});
