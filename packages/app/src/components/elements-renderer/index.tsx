import { Point } from "@kitly/system";
import { TransformedElement } from "../transformed-element";

export function ElementsRenderer({
  ids,
  offset = [0, 0],
}: {
  ids: string[];
  offset?: Point;
}) {
  return (
    <>
      {ids.map((id) => (
        <TransformedElement key={id} id={id}></TransformedElement>
      ))}
    </>
  );
}
