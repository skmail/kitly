import classNames from "classnames";
import { useMemo } from "react";

interface Props {
  box?: number;
  size: number;
  zoom: number;
  position: number;
  direction: "vertical" | "horizontal";
  gap?: boolean;
}
const round = (num: number, v = 50): number => {
  const value = Math.round(num / v) * v;
  if (value === 0) {
    if (v > 1) {
      v = v % 2 === 0 ? v : v - 1;
    }
    return round(num, v / 2);
  }
  return value;
};

export function Ruler({
  gap = true,
  box = 30,
  position,
  size,
  zoom,
  direction,
}: Props) {
  const points = useMemo(() => {
    const zoomedPosition = position / zoom;

    let unit = size / zoom / (size / 100);
    unit = round(Math.pow(2, Math.round(Math.log2(unit))) / 2, 250);
    const zoomUnit = unit * zoom;
    const minRange = Math.floor((-zoomedPosition * zoom) / zoomUnit);
    const maxRange = Math.ceil((-zoomedPosition * zoom + size) / zoomUnit);

    const length = maxRange - minRange;

    const range = [-Infinity, Infinity];

    const points = [];

    let segment = Math.ceil(zoomUnit / size);

    if (!segment || segment === Infinity) {
      segment = 1;
    }

    for (let i = 0; i <= length; i++) {
      const vv = i + minRange;
      const startValue = vv * unit;

      const startPos = (startValue + zoomedPosition) * zoom;

      for (let j = 0; j < segment; j++) {
        const pos = startPos + (j / segment) * zoomUnit;
        let value: number;

        if (direction === "vertical") {
          value = startValue - (j / segment) * unit;
        } else {
          value = startValue + (j / segment) * unit;
        }

        if (pos < 0 || pos >= size || value < range[0] || value > range[1]) {
          continue;
        }

        value = parseFloat(Number(value).toFixed(1));

        const opacity = (zoomUnit % unit) / 100;

        if (direction === "vertical") {
          points.push({
            x: 0,
            y: pos,
            isSub: j > 0,
            label: value,
            opacity,
          });
        } else {
          points.push({
            x: pos,
            y: 0,
            isSub: j > 0,
            label: value,
            opacity,
          });
        }
      }
    }
    return points;
  }, [size, zoom, position, direction]);
  const gapSize = gap ? box : 0;
  return (
    <>
      <div
        className={classNames(
          "absolute bg-zinc-800  border-zinc-700",
          direction === "vertical" && "left-0 border-r",
          direction === "horizontal" && "top-0 border-b"
        )}
        style={{
          height: direction === "vertical" ? size - gapSize : box,
          width: direction === "horizontal" ? size - gapSize : box,
          left: direction === "horizontal" ? gapSize : undefined,
          top: direction === "vertical" ? gapSize : undefined,
        }}
      >
        {points.map((point, key) => (
          <div
            key={key}
            className="bg-zinc-700 absolute"
            style={{
              width: direction == "vertical" ? 4 : 1,
              height: direction == "horizontal" ? 4 : 1,

              left: direction == "horizontal" ? point.x - gapSize : undefined,
              right: direction == "vertical" ? point.x : undefined,
              bottom: direction == "horizontal" ? point.y : undefined,
              top: direction == "vertical" ? point.y - gapSize : undefined,
            }}
            data-o={point.opacity}
            data-k={key}
          >
            {!point.isSub && (
              <span
                className={classNames(
                  "absolute text-[9px] text-zinc-400 transform",

                  direction == "horizontal" &&
                    "left-1/2 -translate-x-1/2 bottom-full",
                  direction == "vertical" &&
                    "right-full origin-top-left  -translate-y-1/2 "
                )}
                style={{
                  writingMode:
                    direction == "vertical" ? "vertical-rl" : undefined,
                }}
              >
                <span
                  className={classNames(
                    direction == "vertical" && "transform scale-[-1] block"
                  )}
                >
                  {point.label}
                </span>
              </span>
            )}
          </div>
        ))}

        <div
          className={classNames(
            "absolute from-zinc-800 to-transparent",
            direction == "horizontal" && "left-0 h-full w-8 bg-gradient-to-r ",
            direction == "vertical" && "bg-gradient-to-b top-0 w-full h-8"
          )}
        />

        <div
          className={classNames(
            "absolute from-zinc-800  to-transparent",
            direction == "horizontal" && "right-0 h-full w-8 bg-gradient-to-l",
            direction == "vertical" && "bg-gradient-to-t bottom-0 w-full h-8"
          )}
        />
      </div>
    </>
  );
}
