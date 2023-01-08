import {
  Element,
  ElementsState,
  ElementTransformationDetails,
  Extension,
  Store,
} from "@kitly/system";
import { TransformState } from "./transform-store";

export interface ElementHighlighterExtension extends Extension {
  stores: {
    useTransformStore: Store<TransformState>;
  };
}

export type TransformResult = {
  elements: Record<string, Element>;
  transformations: Record<string, ElementTransformationDetails>;
  selectionTransformations?: ElementTransformationDetails;
};
