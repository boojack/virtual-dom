import { VElement } from "./VElement";
import { VText } from "./VText";
import { Component } from "../view/Component";
import { View } from "../view/View";

export { VElement } from "./VElement";
export { VText } from "./VText";

export type VNode = VElement | VText;

export class VDom {
  public static createElement(tagName: string, props: VElementProps, children: (VNode | string)[]): VNode {
    const vel = new VElement(tagName, props, children);

    if (this instanceof Component) {
      const ctx = this;
      ctx.vDom = vel;

      vel.listenRender((el) => {
        ctx.rootElement = el;
      });
    }

    return vel;
  }

  public static render(view: VNode | View, root: HTMLElement | null): VNode {
    let vdom = view instanceof View ? view.render() : view;

    if (!root) {
      throw new Error("DOM not found");
    }

    root.innerHTML = "";
    root.appendChild(vdom.render());

    return vdom;
  }
}
