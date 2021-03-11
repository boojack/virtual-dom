import { VElement } from "./VElement";
import { VText } from "./VText";
import { VNode } from "./mod";
import { Patch } from "./patch";

/**
 * figure out the differs between two vDOM
 * @param newElement the boss vDOM
 * @param oldElement the vDOM which will be replaced
 * @returns patches Map<number, Patch[]>: the differs between two vDOM
 */
export function diff(newElement: VNode, oldElement: VNode) {
  const patches = new Map<number, Patch[]>();

  dfsWalkDiffs(newElement, oldElement, { index: 0 }, patches);
  return patches;
}

/**
 * DFS traverse the whole vDOM
 * @param newElement
 * @param oldElement
 * @param walker use for giving the current vDOM a union tag
 * @param patches
 */
function dfsWalkDiffs(newElement: VNode, oldElement: VNode, walker: Walker, patches: Map<number, Patch[]>) {
  const currentIndex = walker.index;
  let currentPatches: Patch[] = diffElements(newElement, oldElement);

  if (currentPatches.length !== 0) {
    if (patches.has(currentIndex)) {
      currentPatches = (patches.get(currentIndex) as Patch[]).concat(currentPatches);
    }
    patches.set(currentIndex, currentPatches);
  }

  if (checkIsBothElement([newElement, oldElement])) {
    newElement = newElement as VElement;
    oldElement = oldElement as VElement;

    const maxlen = Math.max(oldElement.children.length, newElement.children.length);
    const minlen = Math.min(oldElement.children.length, newElement.children.length);
    for (let i = 0; i < minlen; ++i) {
      walker.index++;
      dfsWalkDiffs(newElement.children[i], oldElement.children[i], walker, patches);
    }
    for (let i = minlen; i < maxlen; ++i) {
      dfsWalkDiffs(newElement.children[i], oldElement.children[i], { index: currentIndex }, patches);
    }
  }
}

/**
 * differ elements
 * @param newElement
 * @param oldElement
 * @returns
 */
function diffElements(newElement: VNode, oldElement: VNode) {
  const currentPatches: Patch[] = [];

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
    } else if (newText === oldText) {
      // do nth
    } else {
      currentPatches.push({
        type: "REPLACE",
        element: newElement,
      });
    }
  } else if (checkIsBothElement([newElement, oldElement])) {
    newElement = newElement as VElement;
    oldElement = oldElement as VElement;

    const props = diffProps(newElement.props, oldElement.props);
    if (!checkIsEmptyObject(props)) {
      currentPatches.push({
        type: "PROPS",
        props: props,
      });
    }
  } else {
    currentPatches.push({
      type: "REPLACE",
      element: newElement,
    });
  }

  return currentPatches;
}

/**
 * diff the vDOM props
 */
function diffProps(newProps: Dict<any>, oldProps: Dict<any>) {
  const diffes: Dict<any> = {};

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

// use as the function name says
function checkIsEmptyObject(ob: Object): boolean {
  return Object.keys(ob).length === 0;
}

function checkHasNullElement(obs: VNode[]): boolean {
  for (const o of obs) {
    if (o === null || o === undefined) {
      return true;
    }
  }

  return false;
}

function checkHasTextElement(obs: VNode[]): boolean {
  for (const o of obs) {
    if (o instanceof VText || o.hasOwnProperty("text")) {
      return true;
    }
  }

  return false;
}

function checkIsBothElement(obs: VNode[]): boolean {
  let lastType = null;

  for (const o of obs) {
    if (o instanceof VElement) {
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
