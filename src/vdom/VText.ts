export class VText {
  public text: string;

  constructor(text: string) {
    this.text = text;
  }

  public render() {
    return document.createTextNode(this.text);
  }
}
