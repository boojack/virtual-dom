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
}

export class IMElement {
  public tagName: string;
  public props: Dict;
  public children: (IMElement | IMTextNode)[];

  constructor(tagName: string, props: Dict, children: (IMElement | IMTextNode)[]) {
    this.tagName = tagName;
    this.props = props;
    this.children = children;
  }

  public render() {
    const el = document.createElement(this.tagName);
    const props = this.props;

    for (const key in props) {
      el.setAttribute(key, props[key]);
    }

    const children = this.children;

    for (const child of children) {
      const childEl = child instanceof IMElement ? child.render() : document.createTextNode(child.text);
      el.appendChild(childEl);
    }

    return el;
  }
}
