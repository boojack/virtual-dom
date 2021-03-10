import { VText } from "./VText";

/**
 * VElement
 */
interface Dict {
  [key: string]: any;
}

export class VElement {
  public tagName: string;
  public props: Dict;
  public children: (VElement | VText)[];

  constructor(tagName: string, props: Dict, children: (VElement | VText | string)[]) {
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

  public render() {
    const el = document.createElement(this.tagName);
    const props = this.props;

    for (const key in props) {
      el.setAttribute(key, props[key]);
    }

    const children = this.children;

    for (const child of children) {
      el.appendChild(child.render());
    }

    return el;
  }
}
