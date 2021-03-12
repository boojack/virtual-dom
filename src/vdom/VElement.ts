import { VNode, VText } from "./vdom";

/**
 * VElement
 * 静态虚节点，无任何状态
 */
export class VElement {
  public tagName: string;
  public props: VElementProps;
  public children: VNode[];

  private cb?: (el: HTMLElement) => void;

  constructor(tagName: string, props: VElementProps, children: (VNode | string)[]) {
    this.tagName = tagName;
    this.props = props;
    this.children = [];

    for (const c of children) {
      if (typeof c === "string") {
        this.children.push(new VText(c));
      } else {
        this.children.push(c);
      }
    }
  }

  public render(): HTMLElement {
    const el = document.createElement(this.tagName);
    const props = this.props;

    for (const key in props) {
      const value = props[key];
      const valueType = typeof value;
      if (valueType === "string") {
        el.setAttribute(key, value as string);
      } else if (valueType === "function") {
        const eventType = key as VElementEventsKey;
        const eventHandler = value as VElementEventsValue;

        el.addEventListener(eventType, (ev: Event) => {
          eventHandler.call(this, ev, el);
        });
      }
    }

    const children = this.children;

    for (const child of children) {
      el.appendChild(child.render());
    }

    if (this.cb) {
      this.cb(el);
    }

    return el;
  }

  public listenRender(cb: (el: HTMLElement) => void) {
    this.cb = cb;
  }
}
