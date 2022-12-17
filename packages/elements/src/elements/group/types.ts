import { Element } from "@kitly/system";

export interface GroupElement extends Element<"group"> {
  children: string[];
}
