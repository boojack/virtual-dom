import { VNode, VText } from "./vdom";

/**
 * VElement
 * 静态虚节点，无任何状态
 */
export class VElement {
  public tagName: string;
  public props: VElementProps;
  public children: VNode[];

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
}
