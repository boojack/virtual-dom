import { Component } from "../../src/view/Component";
import { VDom, VNode } from "../../src/vdom/vdom";
import { CounterView } from "./Counter";
import { TimerView } from "./Timer";
import "./index.css";

const Timer = new TimerView({});
const Counter = new CounterView({});

class App extends Component<any, any, any> {
  public state: any;

  public render(): VNode {
    return VDom.createElement("div", { class: "div-container" }, [Timer, Counter]);
  }
}

VDom.render(new App({}), document.querySelector("div.root"));

export {};
