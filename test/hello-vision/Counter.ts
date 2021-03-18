import { VDom } from "../../src/vdom/vdom";
import { Component } from "../../src/view/Component";

interface Props {}

interface State {
  counter: number;
}

export class CounterView extends Component<Props, State, {}> {
  public props: Props;
  public state: State;

  constructor(props: Props) {
    super(props);

    this.props = props;
    this.state = {
      counter: 0,
    };
  }

  public render() {
    return VDom.createElement(
      "div",
      {
        class: "counter-container",
      },
      [
        VDom.createElement("p", {}, ["Click me: "]),
        VDom.createElement(
          "button",
          {
            click: this.handleCounterClick.bind(this),
          },
          ["Counter: ", this.state.counter.toString()]
        ),
      ]
    );
  }

  protected handleCounterClick(ev: Event, el: HTMLElement) {
    const { counter } = this.state;

    this.setState({
      counter: counter + 1,
    });
  }
}
