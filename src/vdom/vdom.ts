import { VElement } from "./VElement";
import { VText } from "./VText";
import { View } from "../view/View";
import { diff } from "./diff";
import { patch } from "./patch";

export { VElement } from "./VElement";
export { VText } from "./VText";
export type VNode = VElement | VText;

export class VDom {
  private static rootEl: HTMLElement;
  private static view: View | VNode;
  private static preVDom: VNode;

  public static createElement(tagName: string, props: VElementProps, children: (VNode | View | string)[]): VNode {
    return new VElement(
      tagName,
      props,
      children.map((child) => {
        if (child instanceof View) {
          return child.doRender();
        }
        return child;
      })
    );
  }

  public static renderVNode(vNode: VNode): HTMLElement | Text {
    if (vNode instanceof VText) {
      return document.createTextNode(vNode.text);
    }

    const el = document.createElement(vNode.tagName);
    const { props, children } = vNode;

    for (const key in props) {
      const value = props[key];
      const valueType = typeof value;
      if (valueType === "string") {
        el.setAttribute(key, value as string);
      } else if (valueType === "function") {
        const eventType = key as VElementEventsKey;
        const eventHandler = value as VElementEventsValue;

        el.addEventListener(eventType, (ev: Event) => {
          eventHandler.call(vNode, ev, el);
        });
      }
    }

    for (const child of children) {
      el.appendChild(VDom.renderVNode(child));
    }

    return el;
  }

  public static render(view: VNode | View, root: HTMLElement | null): VNode {
    if (!root) {
      throw new Error("DOM not found");
    }

    const vdom = view instanceof View ? view.doRender() : view;
    VDom.view = view;
    VDom.preVDom = vdom;
    VDom.rootEl = root;

    root.innerHTML = "";
    root.appendChild(VDom.renderVNode(vdom));

    return vdom;
  }

  public static rerender() {
    if (!VDom.view || !VDom.preVDom || !VDom.rootEl) {
      return;
    }

    const vdom = VDom.view instanceof View ? VDom.view.doRender() : VDom.view;
    const patches = diff(vdom, VDom.preVDom);
    patch(VDom.rootEl, patches, true);
    VDom.preVDom = vdom;
  }
}
