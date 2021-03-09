import { IMElement, IMTextNode } from "./IMElement";

type PatchType = 0 | 1 | 2;

const REPLACE = 0;
const PROPS = 1;
const TEXT = 2;

export interface Patch {
  type: PatchType;

  element?: IMElement | IMTextNode;
  text?: string;
  props?: Dict;
}

export function patch(element: Element, patches: Dict) {
  const walker: Walker = { index: 0 };

  dfsWalk(element, walker, patches);
}

function dfsWalk(element: Element, walker: Walker, patches: Dict) {
  if (patches[walker.index]) {
    applyPatch(element, patches[walker.index]);

    // NOTE: the element had been deleted and not need to walk children
    if (patches[walker.index].type === REPLACE) {
      return;
    }
  }

  const length = element.children.length;
  if (length === 0 && element.textContent !== "") {
    walker.index++;
    if (patches[walker.index]) {
      applyPatch(element, patches[walker.index]);
    }
  }

  const children = [];
  for (let i = 0; i < element.children.length; i++) {
    children.push(element.children[i]);
  }

  for (let i = 0; i < children.length; i++) {
    walker.index++;
    dfsWalk(children[i], walker, patches);
  }
}

function applyPatch(element: Element, patch: Patch) {
  switch (patch.type) {
    case REPLACE: {
      if (!patch.element) {
        element.remove();
      }
      break;
    }
    case PROPS: {
      for (const key in patch.props) {
        if (patch.props[key]) {
          element.setAttribute(key, patch.props[key]);
        } else {
          element.removeAttribute(key);
        }
      }
      break;
    }
    case TEXT: {
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
