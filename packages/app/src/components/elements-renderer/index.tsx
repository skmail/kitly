import { Point } from "@kitly/system";
import { TransformedElement } from "../transformed-element";

export function ElementsRenderer({ ids }: { ids: string[] }) {
  return (
    <>
      {ids.map((id) => (
        <TransformedElement key={id} id={id}></TransformedElement>
      ))}
    </>
  );
}
