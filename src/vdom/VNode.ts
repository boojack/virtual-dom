export abstract class VNode {
  private static idCounter = 0;
  public id: number;

  constructor() {
    this.id = VNode.idCounter++;
    this.beforeMount();
  }

  public beforeMount(): void {}

  public setState() {}

  public abstract render(): any;
}
