/**
 * VText
 * use for a TextNode container
 * the basic vdom
 */
export class VText {
  public text: string;

  constructor(text: string) {
    this.text = text;
  }

  public render(): Text {
    return document.createTextNode(this.text);
  }
}
