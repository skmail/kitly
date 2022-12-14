import { FC } from "react";
import { OnElementUpdate, Element, ElementTransformationDetails } from ".";
import { Spread } from "./internals";
import {
  ElementsState,
  KeyboardState,
  MouseState,
  RaycastState,
  Store,
  WorkspaceState,
} from "./store";

type GetObject<V> = V extends Record<string, any> ? V : {};

type ExtensionToAppStructure<T extends Extension> = GetObject<T["stores"]> &
  GetObject<T["modifiers"]>;

type ParseExtensions<A extends [...Extension[]]> = A extends [
  infer L extends Extension,
  ...infer R extends any[]
]
  ? ExtensionToAppStructure<L> & ParseExtensions<R>
  : unknown;

export type Raycastable<T = string> = {
  type: T;
};

export type Raycaster = <T extends App = App>(app: T) => Raycastable[] | void;
export type RaycastValidator = <T extends App = App>(app: T) => boolean | void;
export type RaycastPost = <T extends App = App>(
  rays: Raycastable[],
  app: T
) => Raycastable[] | void;

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
    ui: {
      pannable: FC[];
      static: FC[];
    };
  };
  [key: string]: any;
};

export type ExtensionModifierCallback = (...args: any[]) => any;

export type ExtensionModifierDetailed = {
  priority: number;
  modifier: ExtensionModifierCallback;
};
export type ExtensionModifier =
  | ExtensionModifierCallback
  | ExtensionModifierDetailed;

export type Extension = {
  elements?: ElementExtension[];
  raycast?: {
    validate?: RaycastValidator;
    raycast?: Raycaster;
    post?: RaycastPost;
  };
  ui?: {
    pannable?: FC;
    static?: FC;
  };
  stores?: Record<string, Store<any>>;
  modifiers?: {
    [key: string]: {
      [key: string]: ExtensionModifier[] | ExtensionModifier;
    };
  };
};

export type ElementExtension = {
  name: string;
  renderer: FC<{
    element: Element;
    transformations: ElementTransformationDetails;
  }>;
  toString(element: Element, app: App): string;
  transformRenderrer: false;
  icon: FC;
  modifiers?: {
    [key: string]: ExtensionModifierCallback;
  };
};
