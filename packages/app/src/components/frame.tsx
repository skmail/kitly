import { shallowEqual } from "@kitly/system";
import { PropsWithChildren, useEffect, useState } from "react";
import BaseFrame from "react-frame-component";
import { useApp } from "../app-provider";

export function Frame({ children }: PropsWithChildren) {
  const app = useApp();
  const size = app.useWorkspaceStore((state) => state.size, shallowEqual);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (size[0] !== 0 || size[1] !== 0) {
      setIsReady(true);
    }
  }, [size]); 

  if (!isReady) {
    return null;
  }

  return (
    <BaseFrame
      style={{
        width: size[0],
        height: size[1],
        position: "absolute",
        left: 0,
        top: 0,
      }}
      mountTarget="body"
      initialContent={
        "<!DOCTYPE html><html><head><style>*{color:#fff;}</style></head><body></body></html>"
      }
    >
      {children}
    </BaseFrame>
  );
}
