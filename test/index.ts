import { render } from "../src/vdom/render";
import { VElement } from "../src/vdom/VElement";

// NOTE: Test case
function tick() {
  const currentTime = "It is " + new Date().toLocaleTimeString();
  const h1 = new VElement("h1", {}, ["Hello vision"]);
  const h2 = new VElement("h2", {}, [currentTime]);
  const div = new VElement("div", { class: "div-container" }, [h1, h2]);

  render(div, document.querySelector("div.root"));
}

setInterval(() => {
  tick();
}, 1000);

export {};
