import { VDom, VNode } from "../src/vdom/vdom";
import { CounterView } from "./Counter";
import { TimerView } from "./Timer";
import { Component } from "../src/view/Component";
import "./index.css";

const Counter = new CounterView({});
const Timer = new TimerView({});

class App extends Component<any, any, any> {
  public state: any;
  public componentWillMount(): void {}
  public render(): VNode {
    return VDom.createElement("div", { class: "div-container" }, [Timer, Counter]);
  }
}

VDom.render(new App({}), document.querySelector("div.root"));

export {};
