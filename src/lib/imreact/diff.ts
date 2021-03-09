import { IMElement, IMTextNode } from "./IMElement";

const REPLACE = 0;
const PROPS = 1;
const TEXT = 2;

interface Dict {
  [key: string]: any;
}
interface Walker {
  index: number;
}

export function diff(newElement: IMElement | IMTextNode, oldElement: IMElement | IMTextNode) {
  const walker: Walker = { index: 0 };
  const patches: Dict = {};

  dfsWalk(newElement, oldElement, walker, patches);

  return patches;
}

function dfsWalk(newElement: IMElement | IMTextNode, oldElement: IMElement | IMTextNode, walker: Walker, patches: Dict) {
  const currentIndex = walker.index;
  let currentPatch;

  if (!newElement || !oldElement) {
    currentPatch = {
      type: REPLACE,
      element: newElement,
    };
  } else if (newElement instanceof IMTextNode || oldElement instanceof IMTextNode) {
    if (newElement instanceof IMTextNode) {
      currentPatch = {
        type: TEXT,
        text: newElement.text,
      };
    } else {
      currentPatch = {
        type: REPLACE,
        element: newElement,
      };
    }
  } else if (newElement.tagName === oldElement.tagName) {
    const props = diffProps(newElement.props, oldElement.props);
    if (!isEmptyObject(props)) {
      currentPatch = {
        type: PROPS,
        props: props,
      };
    }

    for (let i = 0; i < oldElement.children.length; ++i) {
      walker.index++;
      dfsWalk(newElement.children[i], oldElement.children[i], walker, patches);
    }
  } else {
    currentPatch = {
      type: REPLACE,
      element: newElement,
    };
  }

  if (currentPatch) {
    patches[currentIndex] = currentPatch;
  }
}

function diffProps(newProps: Dict, oldProps: Dict) {
  const diffes: Dict = {};

  for (const key in oldProps) {
    const value = oldProps[key];

    if (newProps[key] !== value) {
      diffes[key] = newProps[key];
    }
  }

  for (const key in newProps) {
    if (!oldProps.hasOwnProperty(key)) {
      diffes[key] = newProps[key];
    }
  }

  return diffes;
}

function isEmptyObject(ob: Object): boolean {
  return Object.keys(ob).length === 0;
}
