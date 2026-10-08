// 要素の中身（DOM）を、HTMLの形の文字列に直す。検証ツールの Elements パネルがしていることの簡易版。
export function describeDom(root: Element): string {
  return [...root.childNodes].flatMap((node) => describeNode(node, 0)).join('\n');
}

function describeNode(node: Node, depth: number): string[] {
  const indent = '  '.repeat(depth);

  if (node instanceof Text) {
    const text = node.data.trim();
    return text === '' ? [] : [indent + text];
  }
  if (!(node instanceof Element)) return [];

  // 孫に要素がなければ1行で書く（例：<tr><td>…</td><td>…</td></tr>）。
  const isShallow = [...node.children].every((child) => child.children.length === 0);
  if (isShallow) return [indent + node.outerHTML.replace(/\s*\n\s*/g, '')];

  const tagName = node.tagName.toLowerCase();
  const attributes = [...node.attributes].map((attribute) => ` ${attribute.name}="${attribute.value}"`);
  return [
    `${indent}<${tagName}${attributes.join('')}>`,
    ...[...node.childNodes].flatMap((child) => describeNode(child, depth + 1)),
    `${indent}</${tagName}>`,
  ];
}
