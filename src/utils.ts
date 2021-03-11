import { VElement } from "./vdom/VElement";
import { VText } from "./vdom/VText";

export namespace utils {
  export function deepCloneVNodes(source: VElement | VText): VElement | VText {
    if (source instanceof VText) {
      const copy = new VText(source.text);

      return copy;
    } else {
      const copy = new VElement(source.tagName, { ...source.props }, []);
      for (const child of source.children) {
        copy.children.push(deepCloneVNodes(child));
      }

      return copy;
    }
  }
}
