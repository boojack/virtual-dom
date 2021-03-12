import { VDom, VElement } from "../src/vdom/vdom";
import { CounterView } from "./Counter";
import { TimerView } from "./Timer";
import "./index.css";

const counter = new CounterView({});
const timer = new TimerView({});

// NOTE: Test case
const div = VDom.createElement("div", { class: "div-container" }, [timer.render(), counter.render()]);

VDom.render(div, document.querySelector("div.root"));

export {};
