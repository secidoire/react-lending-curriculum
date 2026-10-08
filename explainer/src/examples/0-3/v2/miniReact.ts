// ミニReact その2：前回のオブジェクトと比べて、違うところだけDOMを直す。

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

function setProp(dom: HTMLElement, key: string, value: unknown): void {
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

// dom（前回 oldNode から作ったもの）を、newNode が表す形に直す。
function update(parent: Node, dom: Node, oldNode: Child, newNode: Child): void {
  // どちらも文字：違っていたら文字だけ書き換える。
  if (typeof oldNode === 'string' && typeof newNode === 'string') {
    if (oldNode !== newNode) dom.textContent = newNode;
    return;
  }
  // 種類が違う（div → p、要素 → 文字 など）：使い回せないので、作り直して置き換える。
  if (typeof oldNode === 'string' || typeof newNode === 'string' || oldNode.type !== newNode.type) {
    parent.replaceChild(createDom(newNode), dom);
    return;
  }
  // 種類が同じ：DOMはそのまま使い、変わった属性と子だけ直す。
  if (dom instanceof HTMLElement) updateProps(dom, oldNode.props, newNode.props);
  updateChildren(dom, oldNode.children, newNode.children);
}

// 子は、先頭から順に「同じ位置のものどうし」を比べる。
function updateChildren(parent: Node, oldChildren: Child[], newChildren: Child[]): void {
  const doms = [...parent.childNodes];

  newChildren.forEach((newChild, index) => {
    const oldChild = oldChildren[index];
    const dom = doms[index];
    if (oldChild === undefined || dom === undefined) parent.appendChild(createDom(newChild));
    else update(parent, dom, oldChild, newChild);
  });
  // 前回より減ったぶんは取り除く。
  for (const dom of doms.slice(newChildren.length)) dom.remove();
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
