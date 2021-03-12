import { VDom, VNode } from "../src/vdom/vdom";
import { Component } from "../src/view/Component";

interface State {
  now: string;
}

export class TimerView extends Component<{}, State, {}> {
  public props: {};
  public state: State;

  constructor(props: {}) {
    super(props);

    this.props = props;
    this.state = {
      now: new Date().toLocaleTimeString(),
    };

    this.init();
  }

  public init() {
    setInterval(() => {
      this.setState({
        now: new Date().toLocaleTimeString(),
      });
    }, 1000);
  }

  public componentWillMount(): void {
    // do nth
  }

  public componentHasShown(): void {
    // do nth
  }

  public render(): VNode {
    return VDom.createElement.call(this, "div", {}, [
      VDom.createElement("h1", {}, ["Hi, I'm Vision~"]),
      VDom.createElement("h1", {}, [this.state.now]),
    ]);
  }
}
