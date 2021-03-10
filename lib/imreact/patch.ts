import { IMElement, IMTextNode } from "./IMElement";

type PatchType = "CREATE" | "REPLACE" | "PROPS" | "TEXT";

export interface Patch {
  type: PatchType;

  element?: IMElement | IMTextNode;
  text?: string;
  props?: Dict;
}

/**
 * apply the patches into the real dom
 * @param element the real dom
 * @param patches differs
 */
export function patch(element: Element, patches: Map<number, Patch[]>) {
  const walker: Walker = { index: 0 };

  dfsWalkPatches(element, walker, patches);
}

/**
 * DFS traverse
 */
function dfsWalkPatches(element: Element, walker: Walker, patches: Map<number, Patch[]>) {
  if (patches.has(walker.index)) {
    for (const patch of patches.get(walker.index) as []) {
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
      if (patch.element !== undefined) {
        element.appendChild(patch.element.render());
      }
      break;
    }
    case "REPLACE": {
      if (!patch || !patch.element) {
        element.remove();
      } else {
        element.parentNode?.replaceChild(patch.element.render(), element);
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
