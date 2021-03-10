import { VElement } from "../src/vdom/VElement";
import { VText } from "../src/vdom/VText";
import { diff } from "../src/vdom/diff";
import { patch } from "../src/vdom/patch";

// NOTE: Test case

const helloText = new VText("hello world");
const p = new VElement("p", { class: "p" }, [helloText]);
let div = new VElement("div", { class: "text", id: "hhh" }, [p]);

const root = div.render();
document.body.appendChild(root);

let i = 0;
const c = setInterval(() => {
  if (i === 4) {
    clearInterval(c);
    return;
  }
  i++;
  const div2 = new VElement("div", { class: "div-container" }, []);
  for (let j = 0; j < i; j++) {
    const timeText = new VElement("p", {}, [i + ": " + Date.now()]);
    div2.children.push(timeText);
  }

  const patches = diff(div2, div);
  patch(root, patches);
  div = div2;
}, 1000);

export {};
