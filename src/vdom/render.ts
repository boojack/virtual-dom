import { diff } from "./diff";
import { VNode } from "./mod";
import { patch } from "./patch";

let vdomTemp: VNode | null = null;

export function render(vdom: VNode, root: HTMLElement | null): VNode {
  if (!root) {
    return vdom;
  }

  if (vdomTemp !== null) {
    const patches = diff(vdom, vdomTemp);
    console.log(vdom, vdomTemp, patches);
    patch(root, patches);
  } else {
    root.innerHTML = "";
    root.appendChild(vdom.render());
  }

  vdomTemp = vdom;

  return vdom;
}
