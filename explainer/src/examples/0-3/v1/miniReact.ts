// ミニReact その1：画面をオブジェクトで表し、毎回すべて作り直す。

// 画面の1つの要素を表すオブジェクト。まだDOMではない、ただのデータ。
export type VNode = { type: string; props: Props; children: Child[] };
export type Props = Record<string, unknown>;
export type Child = VNode | string;

// h() の子として渡せるもの。配列は平らにし、null や false は「何も出さない」として捨てる。
type ChildInput = Child | number | boolean | null | undefined | ChildInput[];

function toChildren(inputs: ChildInput[]): Child[] {
  return inputs.flatMap((input) => {
    if (Array.isArray(input)) return toChildren(input);
    if (input === null || input === undefined || typeof input === 'boolean') return [];
    return [typeof input === 'number' ? String(input) : input];
  });
}

// 「こういう要素がほしい」を表すオブジェクトを作る。
export function h(type: string, props: Props | null, ...children: ChildInput[]): VNode {
  return { type, props: props ?? {}, children: toChildren(children) };
}

function setProp(dom: HTMLElement, key: string, value: unknown): void {
  // onClick → onclick。イベントの処理も、DOMのプロパティとして入れる。
  const name = key.startsWith('on') ? key.toLowerCase() : key;
  if (name in dom) Reflect.set(dom, name, value);
  else dom.setAttribute(name, String(value));
}

// オブジェクトから、本物のDOMを作る。
export function createDom(node: Child): Node {
  if (typeof node === 'string') return document.createTextNode(node);

  const dom = document.createElement(node.type);
  for (const [key, value] of Object.entries(node.props)) setProp(dom, key, value);
  for (const child of node.children) dom.append(createDom(child));
  return dom;
}

// container の中身を、vnode が表す画面にする。いまあるDOMは全部捨てて、作り直す。
export function render(vnode: VNode, container: Element): void {
  container.replaceChildren(createDom(vnode));
}
