import { IMElement, IMTextNode } from "./IMElement";
import { Patch } from "./patch";

export function diff(newElement: IMElement | IMTextNode, oldElement: IMElement | IMTextNode) {
  const walker: Walker = { index: 0 };
  const patches = new Map<number, Patch[]>();

  dfsWalkDiffs(newElement, oldElement, walker, patches);

  return patches;
}

function dfsWalkDiffs(
  newElement: IMElement | IMTextNode,
  oldElement: IMElement | IMTextNode,
  walker: Walker,
  patches: Map<number, Patch[]>
) {
  const currentPatches: Patch[] = [];
  const currentIndex = walker.index;

  if (checkHasNullElement([newElement, oldElement])) {
    if (!oldElement) {
      currentPatches.push({
        type: "CREATE",
        element: newElement,
      });
    } else {
      currentPatches.push({
        type: "REPLACE",
        element: newElement,
      });
    }
  } else if (checkHasTextElement([newElement, oldElement])) {
    const newText = (newElement as any).text || "";
    const oldText = (oldElement as any).text || "";

    if (newText != "" && newText !== oldText) {
      currentPatches.push({
        type: "TEXT",
        text: newText,
      });
    } else {
      currentPatches.push({
        type: "REPLACE",
        element: newElement,
      });
    }
  } else if (checkIsBothElement([newElement, oldElement])) {
    newElement = newElement as IMElement;
    oldElement = oldElement as IMElement;

    const props = diffProps(newElement.props, oldElement.props);
    if (!isEmptyObject(props)) {
      currentPatches.push({
        type: "PROPS",
        props: props,
      });
    }

    const maxlen = Math.max(oldElement.children.length, newElement.children.length);
    const minlen = Math.min(oldElement.children.length, newElement.children.length);
    for (let i = minlen; i < maxlen; ++i) {
      dfsWalkDiffs(newElement.children[i], oldElement.children[i], walker, patches);
    }
    for (let i = 0; i < minlen; ++i) {
      walker.index++;
      dfsWalkDiffs(newElement.children[i], oldElement.children[i], walker, patches);
    }
  } else {
    currentPatches.push({
      type: "REPLACE",
      element: newElement,
    });
  }

  if (currentPatches.length !== 0) {
    if (patches.has(currentIndex)) {
      currentPatches.push(...(patches.get(currentIndex) as Patch[]));
    }
    patches.set(currentIndex, currentPatches);
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

function checkHasNullElement(obs: (IMElement | IMTextNode)[]) {
  for (const o of obs) {
    if (o === null || o === undefined) {
      return true;
    }
  }

  return false;
}

function checkHasTextElement(obs: (IMElement | IMTextNode)[]) {
  for (const o of obs) {
    if (o instanceof IMTextNode || o.hasOwnProperty("text")) {
      return true;
    }
  }

  return false;
}

function checkIsBothElement(obs: (IMElement | IMTextNode)[]) {
  let lastType = null;

  for (const o of obs) {
    if (o instanceof IMElement) {
      if (lastType === null) {
        lastType = o.tagName;
      } else if (o.tagName !== lastType) {
        return false;
      }
    } else {
      return false;
    }
  }

  return true;
}
