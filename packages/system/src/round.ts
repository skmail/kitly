export function round(value: number, precision = 10000000000) {
  return Math.round(value * precision) / precision;
}
