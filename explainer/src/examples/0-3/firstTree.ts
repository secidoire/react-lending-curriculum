import { createDom, h } from './miniReact';

// 画面を「オブジェクト」で書いてから、DOMにする。
export function startFirstTree(root: HTMLElement): void {
  const loan = { itemName: 'リーダブルコード', userName: '佐藤' };

  // 1. 作りたい画面を、h() で書く。ここではまだ、画面には何も出ない。
  const tree = h(
    'p',
    { className: 'loan' },
    h('strong', null, loan.itemName),
    'を',
    loan.userName,
    'さんが借りています',
  );

  // 2. createDom() で本物のDOMにして、画面に入れる。
  root.append(createDom(tree));

  // 3. h() が返したものの中身を、そのまま表示する。
  const dump = document.createElement('pre');
  dump.textContent = JSON.stringify(tree, null, 2);
  root.append(dump);
}
