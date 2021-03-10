/**
 * IMElement
 */
interface Dict {
  [key: string]: any;
}

export class IMTextNode {
  public text: string;

  constructor(text: string) {
    this.text = text;
  }

  public render() {
    return document.createTextNode(this.text);
  }
}

export class IMElement {
  public tagName: string;
  public props: Dict;
  public children: (IMElement | IMTextNode)[];

  constructor(tagName: string, props: Dict, children: (IMElement | IMTextNode | string)[]) {
    this.tagName = tagName;
    this.props = props;
    this.children = [];

    for (const c of children) {
      if (typeof c === "string") {
        this.children.push(new IMTextNode(c));
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
