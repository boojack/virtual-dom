import { VElement } from "../src/vdom/mod";
import { render } from "../src/vdom/render";

// NOTE: Test case
function tick() {
  const currentTime = "It is " + new Date().toLocaleTimeString();
  const br = new VElement("br", {}, []);
  const h1 = new VElement(
    "h1",
    {
      click: function (ev: Event, el: HTMLElement) {
        console.log(this, ev, el);
      },
    },
    ["Hello vision", br, currentTime]
  );

  const div = new VElement("div", { class: "div-container" }, [h1]);

  render(div, document.querySelector("div.root"));
}

setInterval(() => {
  tick();
}, 1000);

export {};
