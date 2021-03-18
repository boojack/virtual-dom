import { VDom, VNode } from "../vdom/vdom";
import { View } from "./View";

export abstract class Component<Props, State, E> extends View {
  // readonly
  public props: Props;
  public abstract state: State;

  constructor(props: Props) {
    super();
    this.props = Object.freeze(props);

    this.componentWillMount();
  }

  public setState(state: State) {
    this.state = state;

    VDom.rerender();
  }

  public destory() {
    // TODO
  }

  public abstract componentWillMount(): void;
  // public abstract componentHasShown(): void;

  public abstract render(): VNode;

  public doRender(): VNode {
    const vel = this.render();

    return vel;
  }
}
