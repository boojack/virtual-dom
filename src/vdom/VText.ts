import { VNode } from "./VNode";

export class VText extends VNode {
  public text: string;

  constructor(text: string) {
    super();
    this.text = text;
  }

  public render(): Text {
    return document.createTextNode(this.text);
  }
}
