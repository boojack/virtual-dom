import { VNode } from "../vdom/vdom";

/**
 * View
 */
export abstract class View {
  public abstract render(): VNode;
  public abstract doRender(): VNode;
}
