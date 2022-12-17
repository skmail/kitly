import { FC } from "react";
import { OnElementUpdate, Element } from ".";
import { Spread } from "./internals";
import {
  ElementsState,
  KeyboardState,
  MouseState,
  RaycastState,
  Store,
  WorkspaceState,
} from "./store";

type ExtensionToAppStructure<T extends Extension> = T["stores"] extends Record<
  string,
  any
>
  ? T["stores"]
  : {};

type ParseExtensions<A extends [...Extension[]]> = A extends [
  infer L extends Extension,
  ...infer R extends any[]
]
  ? ExtensionToAppStructure<L> & ParseExtensions<R>
  : unknown;

export type Raycastable<T = string> = {
  type: T;
};

export type Raycaster = <T extends App = App>(app: T) => Raycastable | void;
export type RaycastValidator = <T extends App = App>(app: T) => boolean | void;
export type RaycastPost = <T extends App = App>(
  result: {
    ray: Raycastable;
    stack: Raycastable[];
  },
  app: T
) => boolean | Raycastable | void;

export type App<E extends Extension[] = Extension[]> = {
  stores: Spread<[ParseExtensions<E>, {}]>;
  useElementsStore: Store<ElementsState>;
  useWorkspaceStore: Store<WorkspaceState>;
  useMouseStore: Store<MouseState>;
  useKeyboardStore: Store<KeyboardState>;
  useRaycastStore: Store<RaycastState>;
  dom: {
    workspace?: HTMLDivElement;
  };
  extensions: {
    elements: Map<string, ElementExtension>;
    raycasters: {
      raycasters: Raycaster[];
      validators: RaycastValidator[];
      post: RaycastPost[];
    };
    ui: FC[];
  };
};

export type Extension = {
  elements?: ElementExtension[];
  raycast?: {
    validate?: RaycastValidator;
    raycast?: Raycaster;
    post?: RaycastPost;
  };
  ui?: FC;
  stores?: Record<string, Store<any>>;
};

export type ElementExtension = {
  name: string;
  renderer: FC<{
    element: Element;
    onUpdate: OnElementUpdate;
  }>;
  toString(element: Element, app: App): string;
  transformRenderrer: false;
};
