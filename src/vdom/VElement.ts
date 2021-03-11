import { VNode } from "./mod";
import { VText } from "./VText";

/**
 * VElement
 */
export class VElement {
  public tagName: string;
  public props: VNodeProps;
  public children: VNode[];

  constructor(tagName: string, props: VNodeProps, children: (VNode | string)[]) {
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

  public beforeMount(): void {}

  public render(): HTMLElement {
    const el = document.createElement(this.tagName);

    const props = this.props;

    for (const key in props) {
      if (typeof props[key] === "string") {
        el.setAttribute(key, props[key] as string);
      }
    }

    const children = this.children;

    for (const child of children) {
      el.appendChild(child.render());
    }

    return el;
  }
}
