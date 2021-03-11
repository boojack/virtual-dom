import { diff } from "./diff";
import { patch } from "./patch";
import { VNode } from "./VNode";

let vdomTemp: VNode | null = null;

export function render(vdom: VNode, root: HTMLElement | null): VNode {
  if (!root) {
    return vdom;
  }

  if (vdomTemp !== null) {
    const patches = diff(vdom as any, vdomTemp as any);
    console.log(vdom, vdomTemp, patches);
    patch(root, patches);
  } else {
    root.innerHTML = "";
    root.appendChild(vdom.render());
  }

  vdomTemp = vdom;

  return vdom;
}
