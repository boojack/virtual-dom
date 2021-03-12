import { diff } from "../vdom/diff";
import { patch } from "../vdom/patch";
import { VNode } from "../vdom/vdom";
import { View } from "./View";

export abstract class Component<Props, State, E> extends View {
  public abstract props: Props;
  public abstract state: State;
  public vDom?: VNode;
  public rootElement?: HTMLElement;

  constructor(props: Props) {
    super(props);
    this.componentWillMount();
  }

  public setState(state: State) {
    const preVDom = this.vDom;
    const preDom = this.rootElement;

    this.state = state;
    const nextVDom = this.render();
    const patches = diff(nextVDom, preVDom as VNode);
    patch(preDom as HTMLElement, patches, false);
  }

  public destory() {
    // TODO
  }

  public abstract componentWillMount(): void;
  public abstract componentHasShown(): void;

  public abstract render(): VNode;

  private doRender() {}
}
