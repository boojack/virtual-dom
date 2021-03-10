import { IMElement, IMTextNode } from "../src/vdom/VElement";
import { diff } from "../src/vdom/diff";
import { patch } from "../src/vdom/patch";

// NOTE: Test case

const helloText = new IMTextNode("hello world");
const p = new IMElement("p", { class: "p" }, [helloText]);
let div = new IMElement("div", { class: "text", id: "hhh" }, [p]);

const root = div.render();
document.body.appendChild(root);

let i = 0;
const c = setInterval(() => {
  if (i === 4) {
    clearInterval(c);
    return;
  }
  i++;
  const div2 = new IMElement("div", { class: "div-container" }, []);
  for (let j = 0; j < i; j++) {
    const timeText = new IMElement("p", {}, [i + ": " + Date.now()]);
    div2.children.push(timeText);
  }

  const patches = diff(div2, div);
  patch(root, patches);
  div = div2;
}, 1000);

export {};
