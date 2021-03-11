import { VNode } from "./mod";

type PatchType = "CREATE" | "REPLACE" | "PROPS" | "TEXT";

export interface Patch {
  type: PatchType;

  vNode?: VNode;
  text?: string;
  props?: Dict<any>;
}

/**
 * apply the patches into the real dom
 * @param element the real dom
 * @param patches differs
 */
export function patch(element: Element, patches: Map<number, Patch[]>, fromRoot: boolean = false) {
  const walker: Walker = { index: 0 };

  if (fromRoot) {
    // NOTE: 由于render 里 element 为root，此处暂时从 -1 开始
    walker.index = -1;
  }

  dfsWalkPatches(element, walker, patches);
}

/**
 * DFS traverse
 */
function dfsWalkPatches(element: Element, walker: Walker, patches: Map<number, Patch[]>) {
  if (patches.has(walker.index)) {
    for (const patch of patches.get(walker.index) as Patch[]) {
      applyPatch(element, patch);
    }
  }

  const children = Array.from(element.childNodes) as Element[];

  for (let i = 0; i < children.length; i++) {
    walker.index++;
    dfsWalkPatches(children[i], walker, patches);
  }
}

/**
 * apply the patch to an element
 */
function applyPatch(element: Element, patch: Patch) {
  switch (patch.type) {
    case "CREATE": {
      if (patch.vNode) {
        element.appendChild(patch.vNode.render());
      }
      break;
    }
    case "REPLACE": {
      if (!patch.vNode) {
        element.remove();
      } else {
        element.parentNode?.replaceChild(patch.vNode.render(), element);
      }
      break;
    }
    case "PROPS": {
      for (const key in patch.props) {
        if (patch.props[key]) {
          element.setAttribute(key, patch.props[key]);
        } else {
          element.removeAttribute(key);
        }
      }
      break;
    }
    case "TEXT": {
      element.textContent = patch.text || "";
      break;
    }
    default: {
      // TODO
      element.remove();
    }
  }
}

export {};
