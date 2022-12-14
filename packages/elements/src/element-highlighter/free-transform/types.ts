export type Mode = "scale" | "translate" | "rotate" | "warp";

export type AnyEventPayload = { type: Mode; handle?: [number, number] };
