import { utils } from "../src/utils";
import { diff } from "../src/vdom/diff";
import { patch } from "../src/vdom/patch";
import { VElement } from "../src/vdom/VElement";
import { VText } from "../src/vdom/VText";

export class TimeHeader extends VElement {
  public tagName: string = "div";
  public props: VNodeProps;
  public element?: HTMLElement;

  constructor(props: VNodeProps, text?: string) {
    super("h1", props, []);

    this.props = props;
  }

  public render() {
    const el = document.createElement(this.tagName);
    const props = this.props;

    for (const key in props) {
      if (typeof props[key] === "string") {
        el.setAttribute(key, props[key] as string);
      }
    }
    const timer = new VElement("p", {}, [Date.now() + ""]);
    this.children.push(timer);

    const children = this.children;

    for (const child of children) {
      el.appendChild(child.render());
    }

    this.element = el;
    this.addEventListener("click", this.handleClick);
    return el;
  }

  protected handleClick(ev: Event, el: HTMLElement) {
    if (!this.element) {
      return;
    }

    const copy = utils.deepCloneVNodes(this);
    const timer = new VElement("p", {}, [Date.now() + ""]);
    this.children.push(timer);

    const patches = diff(this as VElement, copy);
    console.log(this, copy, patches);
    patch(this.element, patches);
  }

  private addEventListener(eventType: keyof HTMLElementEventMap, callback: (ev: Event, el: HTMLElement) => any) {
    if (!this.element) {
      return;
    }

    const ctx = this;

    this.element.addEventListener(eventType, function (e: Event) {
      callback.call(ctx, e, this);
    });
  }
}
