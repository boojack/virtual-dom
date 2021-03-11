import { VElement } from "../src/vdom/VElement";
import { VText } from "../src/vdom/VText";
import { diff } from "../src/vdom/diff";
import { patch } from "../src/vdom/patch";
import { TimeHeader } from "./TimeHeader";
import { utils } from "../src/utils";

// NOTE: Test case

const helloText = new VText("hello world");
const p = new VElement("p", { class: "p" }, [helloText]);
let div = new VElement("div", { class: "text", id: "hhh" }, [new TimeHeader({}, "hello")]);

const root = div.render();
document.body.appendChild(root);

// const c = setInterval(() => {
//   console.log(div);
//   const patches = diff(div2, div);
//   patch(root, patches);
//   div = div2;
//   console.log(div);
// }, 1000);

export {};
