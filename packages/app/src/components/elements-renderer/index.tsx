import { shallowEqual } from "@kitly/system";
import { useApp } from "../../app-provider";
import { TransformedElement } from "../transformed-element";

export function ElementsRenderer() {
  const app = useApp();
  const ids = app.useElementsStore((state) => state.ids, shallowEqual);

  return (
    <>
      {ids.map((id) => (
        <TransformedElement key={id} id={id} />
      ))}
    </>
  );
}
