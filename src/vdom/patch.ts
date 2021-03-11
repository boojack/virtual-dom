import { VNode } from "./mod";

type PatchType = "CREATE" | "REPLACE" | "PROPS" | "TEXT";

export interface Patch {
  type: PatchType;

  vNode?: VNode;
  text?: string;
  props?: VElementProps;
}

/**
 * apply the patches into the real dom
 * @param element the real dom
 * @param patches differs
 */
export function patch(element: HTMLElement, patches: Map<number, Patch[]>, fromRoot: boolean = false) {
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
function dfsWalkPatches(element: HTMLElement, walker: Walker, patches: Map<number, Patch[]>) {
  if (patches.has(walker.index)) {
    for (const patch of patches.get(walker.index) as Patch[]) {
      applyPatch(element, patch);
    }
  }

  const children = Array.from(element.childNodes) as Element[];

  for (let i = 0; i < children.length; i++) {
    walker.index++;
    dfsWalkPatches(children[i] as HTMLElement, walker, patches);
  }
}

/**
 * apply the patch to an element
 */
function applyPatch(element: HTMLElement, patch: Patch) {
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
        if (typeof patch.props[key] === "string") {
          const value = patch.props[key] as string;

          if (patch.props[key]) {
            element.setAttribute(key, value);
          } else {
            element.removeAttribute(key);
          }
        } else if (typeof patch.props[key] === "function") {
          // TODO: how to polish event handler
          // const eventType = key as VElementEventsKey;
          // const eventHandler = patch.props[key] as VElementEventsValue;
          // element.addEventListener(eventType, (ev: Event) => {
          //   eventHandler.call(this, ev, element);
          // });
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
