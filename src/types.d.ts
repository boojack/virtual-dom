type BasicType = string | number | boolean;

/** 值为 T 类型的字典 */
interface Dict<T> {
  [key: string]: T;
}

interface Walker {
  index: number;
}

type VElementEventsKey = keyof HTMLElementEventMap;
type VElementEventsValue = (ev: Event, el: HTMLElement, args?: any) => any;
type VElementPropsKey = VElementEventsKey | string;
type VElementAttrsValue = BasicType | VElementAttrs | VElementAttrs[];

type VElementProps = {
  [key in VElementEventsKey | string]: VElementAttrsValue | VElementEventsValue;
};

type VElementAttrs = {
  [key: string]: VElementAttrsValue;
};

type VElementEvents = {
  [key in VElementEventsKey]: VElementEventsValue;
};
