type BasicType = string | number | boolean;

/** 值为 T 类型的字典 */
interface Dict<T> {
  [key: string]: T;
}

interface Walker {
  index: number;
}

interface VElementProps {
  [key: string]: BasicType | VElementProps | VElementProps[];
}
