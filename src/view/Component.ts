import { VDom, VNode } from "../vdom/vdom";
import { View } from "./View";

export abstract class Component<Props, State, E> extends View {
  // readonly
  public props: Props;
  public abstract state: State;
  private vdom?: VNode;

  constructor(props: Props) {
    super();
    this.props = Object.freeze(props);

    this.componentWillMount();
  }

  public setState(state: State) {
    this.state = state;

    VDom.rerender();
    // patch(preDom as HTMLElement, patches, false);
  }

  public destory() {
    // TODO
  }

  public abstract componentWillMount(): void;
  // public abstract componentHasShown(): void;

  public abstract render(): VNode;

  public doRender(): VNode {
    const vel = this.render();
    this.vdom = vel;

    return vel;
  }
}
