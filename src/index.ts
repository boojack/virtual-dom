import { IMElement, IMTextNode } from "./lib/imreact/IMElement";
import { diff } from "./lib/imreact/diff";
import { patch } from "./lib/imreact/patch";

const p = new IMElement("p", { class: "p" }, [new IMTextNode("hello world")]);
const div = new IMElement("div", { class: "text", id: "hhh" }, [p, p, p]);

const timeText = new IMTextNode("hey yo");
const p2 = new IMElement("p", { class: "p" }, [timeText]);
const div2 = new IMElement("div", { class: "div-container" }, [p2]);

const root = div.render();
document.body.appendChild(root);

setInterval(() => {
  timeText.text = "" + Date.now();
  const patches = diff(div2, div);
  patch(root, patches);
}, 1000);

export {};
