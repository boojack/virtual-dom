import { VNode, VElement, VText } from "./vdom";
import { Patch } from "./patch";

/**
 * figure out the differs between two vDOM
 * @param vdom the boss vDOM
 * @param oldVdom the vDOM which will be replaced
 * @returns patches Map<number, Patch[]>: the differs between two vDOM
 */
export function diff(vdom: VNode, oldVdom: VNode) {
  const patches = new Map<number, Patch[]>();

  dfsWalkDiffs(vdom, oldVdom, { index: 0 }, patches);
  return patches;
}

/**
 * DFS traverse the whole vDOM
 * @param vdom
 * @param obsVdom
 * @param walker use for giving the current vDOM a union tag
 * @param patches
 */
function dfsWalkDiffs(vdom: VNode, obsVdom: VNode, walker: Walker, patches: Map<number, Patch[]>) {
  const currentIndex = walker.index;
  let currentPatches: Patch[] = diffElements(vdom, obsVdom);

  if (currentPatches.length !== 0) {
    if (patches.has(currentIndex)) {
      currentPatches = (patches.get(currentIndex) as Patch[]).concat(currentPatches);
    }
    patches.set(currentIndex, currentPatches);
  }

  if (checkIsSameTagElement([vdom, obsVdom])) {
    vdom = vdom as VElement;
    obsVdom = obsVdom as VElement;

    const maxlen = Math.max(obsVdom.children.length, vdom.children.length);
    const minlen = Math.min(obsVdom.children.length, vdom.children.length);
    for (let i = 0; i < minlen; ++i) {
      walker.index++;
      dfsWalkDiffs(vdom.children[i], obsVdom.children[i], walker, patches);
    }
    for (let i = minlen; i < maxlen; ++i) {
      dfsWalkDiffs(vdom.children[i], obsVdom.children[i], { index: currentIndex }, patches);
    }
  }
}

/**
 * differ elements
 * @param element
 * @param obsElement
 * @returns
 */
function diffElements(element: VNode, obsElement: VNode) {
  const currentPatches: Patch[] = [];

  if (checkHasNullElement([element, obsElement])) {
    if (!obsElement) {
      currentPatches.push({
        type: "CREATE",
        vNode: element,
      });
    } else {
      // TODO: 是否应该换成 DELETE
      currentPatches.push({
        type: "REPLACE",
        vNode: element,
      });
    }
  } else if (checkHasTextElement([element, obsElement])) {
    const text = (element as any).text || "";
    const obsText = (obsElement as any).text || "";

    if (text != "" && text !== obsText) {
      currentPatches.push({
        type: "TEXT",
        text: text,
      });
    } else if (text !== obsText) {
      currentPatches.push({
        type: "REPLACE",
        vNode: element,
      });
    }
  } else if (checkIsSameTagElement([element, obsElement])) {
    element = element as VElement;
    obsElement = obsElement as VElement;

    const props = diffElementProps(element.props, obsElement.props);
    if (!checkIsEmptyObject(props)) {
      currentPatches.push({
        type: "PROPS",
        props: props,
      });
    }
  } else {
    currentPatches.push({
      type: "REPLACE",
      vNode: element,
    });
  }

  return currentPatches;
}

/**
 * diff the vDOM props
 */
function diffElementProps(props: VElementProps, obsProps: VElementProps) {
  const diffes: VElementProps = {};

  for (const key in obsProps) {
    const value = props[key];
    const obsValue = obsProps[key];
    const valueType = typeof value;
    const obsValueType = typeof obsValue;

    if (valueType === obsValueType) {
      if (valueType === "string" && value !== obsValue) {
        diffes[key] = value;
      }
      if (valueType === "function" && value.toString() !== obsValue.toString()) {
        diffes[key] = value;
      }
    } else {
      diffes[key] = value;
    }
  }

  for (const key in props) {
    if (!obsProps.hasOwnProperty(key)) {
      diffes[key] = props[key];
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
    if (o instanceof VText) {
      return true;
    }
  }

  return false;
}

function checkIsSameTagElement(obs: VNode[]): boolean {
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
