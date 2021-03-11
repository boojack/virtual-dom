# Virtual DOM

The project aims to achieve the important concept: Virtual DOM.

Dev doc: [Virtual DOM](https://www.notion.so/Virtual-DOM-7672a4e819904ebe8c33a1360cb0ebd4)

## How to read the code

The source code folder just like this:

```java
/src
  /vdom           // virtual dom about
    VElement.ts   // define the vDOM element, such as Element/TextNode
    VText.ts      // define the vDOM element, such as Element/TextNode
    diff.ts       // figure out the differences between two vDOM
    patch.ts      // apply the differs to the real DOM
    render.ts     // mock ReactDOM.render()
```

Above all, `diff.ts` and `patch.ts` have the most important concepts about virtual dom. So, just check them out clearly.
