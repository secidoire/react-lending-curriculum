// root の中から selector に合う要素を探し、期待した種類の要素であることを確かめて返す。
// 見つからない・種類が違うときは、黙って進まずにその場で止める。
export function find<T extends Element>(root: ParentNode, selector: string, type: new () => T): T {
  const element = root.querySelector(selector);
  if (!(element instanceof type)) {
    throw new Error(`${selector} に合う ${type.name} が見つかりません`);
  }
  return element;
}
