import { IMElement, IMTextNode } from "./lib/imreact/IMElement";
import { diff } from "./lib/imreact/diff";
import { patch } from "./lib/imreact/patch";

const helloText = new IMTextNode("hello world");
const p = new IMElement("p", { class: "p" }, [helloText]);
let div = new IMElement("div", { class: "text", id: "hhh" }, [p]);

const p2 = new IMElement("p", { class: "p123" }, [helloText]);
const div2 = new IMElement("div", { class: "div-container" }, [p2]);

const root = div.render();
document.body.appendChild(root);

const c = setInterval(() => {
  const timeText = new IMElement("p", {}, ["" + Date.now()]);
  div2.children.push(timeText);

  const patches = diff(div2, div);
  console.log(patches);
  patch(root, patches);
  div = JSON.parse(JSON.stringify(div2));
}, 2000);

export {};
