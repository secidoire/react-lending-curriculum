// ミニReact（完成版）：前回のオブジェクトと比べて、違うところだけDOMを直す。子は key で対応づける。

export type VNode = { type: string; props: Props; children: Child[] };
export type Props = Record<string, unknown>;
export type Child = VNode | string;

type ChildInput = Child | number | boolean | null | undefined | ChildInput[];

function toChildren(inputs: ChildInput[]): Child[] {
  return inputs.flatMap((input) => {
    if (Array.isArray(input)) return toChildren(input);
    if (input === null || input === undefined || typeof input === 'boolean') return [];
    return [typeof input === 'number' ? String(input) : input];
  });
}

export function h(type: string, props: Props | null, ...children: ChildInput[]): VNode {
  return { type, props: props ?? {}, children: toChildren(children) };
}

// `/** @jsx h */` を付けたファイルで、JSXの型を決めるための宣言。実行時には何も残らない。
/* eslint-disable @typescript-eslint/no-namespace -- TypeScriptは、JSXの型を「変換先の関数と同じ名前の namespace」から探す決まりのため */
export declare namespace h {
  namespace JSX {
    type Element = VNode;
    interface IntrinsicElements {
      [tagName: string]: Props;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

function setProp(dom: HTMLElement, key: string, value: unknown): void {
  // key は対応づけのための目印で、DOMには書かない。
  if (key === 'key') return;
  const name = key.startsWith('on') ? key.toLowerCase() : key;
  if (value === undefined) {
    // 今回は指定されなくなった：イベントの処理は外し、属性は取り除く。
    if (name.startsWith('on')) Reflect.set(dom, name, null);
    else dom.removeAttribute(name === 'className' ? 'class' : name);
  } else if (name in dom) {
    Reflect.set(dom, name, value);
  } else {
    dom.setAttribute(name, String(value));
  }
}

export function createDom(node: Child): Node {
  if (typeof node === 'string') return document.createTextNode(node);

  const dom = document.createElement(node.type);
  for (const [key, value] of Object.entries(node.props)) setProp(dom, key, value);
  for (const child of node.children) dom.append(createDom(child));
  return dom;
}

// 前回と今回の props を比べて、違うものだけDOMに書く。
function updateProps(dom: HTMLElement, oldProps: Props, newProps: Props): void {
  for (const key of Object.keys(oldProps)) {
    if (!(key in newProps)) setProp(dom, key, undefined);
  }
  for (const [key, value] of Object.entries(newProps)) {
    if (oldProps[key] !== value) setProp(dom, key, value);
  }
}

// dom（前回 oldNode から作ったもの）を、newNode が表す形に直す。直したあとのDOMを返す。
function update(parent: Node, dom: Node, oldNode: Child, newNode: Child): Node {
  // どちらも文字：違っていたら文字だけ書き換える。
  if (typeof oldNode === 'string' && typeof newNode === 'string') {
    if (oldNode !== newNode) dom.textContent = newNode;
    return dom;
  }
  // 種類が違う（div → p、要素 → 文字 など）：使い回せないので、作り直して置き換える。
  if (typeof oldNode === 'string' || typeof newNode === 'string' || oldNode.type !== newNode.type) {
    const created = createDom(newNode);
    parent.replaceChild(created, dom);
    return created;
  }
  // 種類が同じ：DOMはそのまま使い、変わった属性と子だけ直す。
  if (dom instanceof HTMLElement) updateProps(dom, oldNode.props, newNode.props);
  updateChildren(dom, oldNode.children, newNode.children);
  return dom;
}

function keyOf(node: Child | undefined): unknown {
  return typeof node === 'object' ? node.props.key : undefined;
}

// 今回の index 番目の子に対応する、前回の子の位置を探す。
// key があれば key が同じもの、なければ同じ位置のもの（それも key なしの場合だけ）。
function findOldIndex(
  newChild: Child,
  index: number,
  oldChildren: Child[],
  oldIndexByKey: Map<unknown, number>,
): number | undefined {
  const key = keyOf(newChild);
  if (key !== undefined) return oldIndexByKey.get(key);
  return keyOf(oldChildren[index]) === undefined ? index : undefined;
}

function updateChildren(parent: Node, oldChildren: Child[], newChildren: Child[]): void {
  const oldDoms = [...parent.childNodes];
  const oldIndexByKey = new Map<unknown, number>();
  oldChildren.forEach((child, index) => {
    const key = keyOf(child);
    if (key !== undefined) oldIndexByKey.set(key, index);
  });

  const reused = new Set<Node>();
  newChildren.forEach((newChild, index) => {
    const oldIndex = findOldIndex(newChild, index, oldChildren, oldIndexByKey);
    const oldChild = oldIndex === undefined ? undefined : oldChildren[oldIndex];
    const oldDom = oldIndex === undefined ? undefined : oldDoms[oldIndex];

    // 対応する相手がいれば、そのDOMを直して使う。いなければ新しく作る。
    const dom =
      oldChild === undefined || oldDom === undefined ? createDom(newChild) : update(parent, oldDom, oldChild, newChild);
    reused.add(dom);

    // 今回の位置にいなければ、そこへ入れる（新しく作ったものと、順番が変わったもの）。
    if (parent.childNodes[index] !== dom) parent.insertBefore(dom, parent.childNodes[index] ?? null);
  });

  // 今回使われなかった前回のDOMは取り除く。
  for (const dom of oldDoms) {
    if (!reused.has(dom) && dom.parentNode === parent) dom.remove();
  }
}

// container ごとに、前回描いたオブジェクトを覚えておく。
const rendered = new WeakMap<Element, VNode>();

// container の中身を、vnode が表す画面にする。2回目からは、前回と比べて違うところだけ直す。
export function render(vnode: VNode, container: Element): void {
  const previous = rendered.get(container);
  const dom = container.firstChild;

  if (previous === undefined || dom === null) container.replaceChildren(createDom(vnode));
  else update(container, dom, previous, vnode);

  rendered.set(container, vnode);
}
