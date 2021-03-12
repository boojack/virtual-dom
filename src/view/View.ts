import { VNode } from "../vdom/vdom";

/**
 * View
 */
export abstract class View {
  constructor(props: Dict<any>) {}
  public abstract render(): VNode;
}
