import { beforeEach, describe, expect, it } from 'vitest';
import { createDom, h, render } from './miniReact';

let container: HTMLElement;
beforeEach(() => {
  container = document.createElement('div');
  document.body.replaceChildren(container);
});

describe('h', () => {
  it('要素を表すオブジェクトを返す', () => {
    expect(h('li', { className: 'loan' }, '佐藤')).toEqual({
      type: 'li',
      props: { className: 'loan' },
      children: ['佐藤'],
    });
  });

  it('子の配列を平らにし、数は文字にし、null・false・true は捨てる', () => {
    const node = h('ul', null, [h('li', null, 1), h('li', null, 2)], null, false, true, '末尾');

    expect(node.children).toEqual([h('li', null, '1'), h('li', null, '2'), '末尾']);
  });
});

describe('createDom', () => {
  it('オブジェクトからDOMを作る。イベントの処理も付く', () => {
    let clicked = 0;
    const dom = createDom(h('button', { type: 'button', 'aria-label': '削除', onClick: () => (clicked += 1) }, '×'));
    container.append(dom);

    const button = container.querySelector('button');
    button?.click();

    expect(button?.outerHTML).toBe('<button type="button" aria-label="削除">×</button>');
    expect(clicked).toBe(1);
  });
});

describe('render', () => {
  it('種類が同じ要素は使い回し、変わった文字と属性だけ直す', () => {
    render(h('p', { className: 'a', title: '消える属性' }, '貸出中'), container);
    const before = container.firstChild;

    render(h('p', { className: 'b' }, '返却済'), container);

    expect(container.firstChild).toBe(before);
    expect(container.innerHTML).toBe('<p class="b">返却済</p>');
  });

  it('種類が違う要素は作り直す', () => {
    render(h('div', null, h('p', null, '文')), container);
    const before = container.querySelector('p');

    render(h('div', null, h('h2', null, '文')), container);

    expect(container.innerHTML).toBe('<div><h2>文</h2></div>');
    expect(before?.isConnected).toBe(false);
  });

  it('子が増えたら足し、減ったら取り除く', () => {
    const list = (names: string[]) => h('ul', null, names.map((name) => h('li', null, name)));

    render(list(['A']), container);
    render(list(['A', 'B', 'C']), container);
    expect(container.textContent).toBe('ABC');

    render(list(['A']), container);
    expect(container.textContent).toBe('A');
  });

  it('key がなければ位置で対応づけるので、先頭に足すと既存のDOMが別の項目に使い回される', () => {
    const list = (names: string[]) => h('ul', null, names.map((name) => h('li', null, name)));
    render(list(['A', 'B']), container);
    const domOfA = container.querySelector('li');

    render(list(['新', 'A', 'B']), container);

    expect(container.textContent).toBe('新AB');
    expect(domOfA?.textContent).toBe('新');
  });

  it('key があれば key で対応づけるので、先頭に足しても既存のDOMは同じ項目のまま', () => {
    const list = (names: string[]) => h('ul', null, names.map((name) => h('li', { key: name }, name)));
    render(list(['A', 'B']), container);
    const domOfA = container.querySelector('li');

    render(list(['新', 'A', 'B']), container);

    expect(container.textContent).toBe('新AB');
    expect(domOfA?.textContent).toBe('A');
  });

  it('key があれば、並べ替え・削除でもDOMが項目についていく', () => {
    const list = (names: string[]) => h('ul', null, names.map((name) => h('li', { key: name }, name)));
    render(list(['A', 'B', 'C']), container);
    const [domOfA, , domOfC] = container.querySelectorAll('li');

    render(list(['C', 'A']), container);

    expect(container.textContent).toBe('CA');
    expect([...container.querySelectorAll('li')]).toEqual([domOfC, domOfA]);
  });

  it('key を DOM の属性として書き出さない', () => {
    render(h('ul', null, h('li', { key: 'a' }, 'A')), container);

    expect(container.innerHTML).toBe('<ul><li>A</li></ul>');
  });
});

describe('DOMの変更の少なさ', () => {
  // render の最中に、container の中で起きた変更の記録を集める。
  function recordMutations(action: () => void): MutationRecord[] {
    const observer = new MutationObserver(() => {});
    observer.observe(container, { childList: true, subtree: true, attributes: true, characterData: true });
    action();
    const records = observer.takeRecords();
    observer.disconnect();
    return records;
  }

  const list = (statuses: string[]) =>
    h('ul', null, statuses.map((status, index) => h('li', { key: index }, h('span', null, status), h('input', { size: 5 }))));

  it('文字が1か所変わっただけなら、DOMの変更も文字1か所だけ', () => {
    render(list(['貸出中', '貸出中', '貸出中']), container);

    const records = recordMutations(() => render(list(['返却済', '貸出中', '貸出中']), container));

    expect(records.map((record) => record.type)).toEqual(['characterData']);
  });

  it('何も変わっていなければ、DOMには何もしない', () => {
    render(list(['貸出中', '貸出中']), container);

    expect(recordMutations(() => render(list(['貸出中', '貸出中']), container))).toEqual([]);
  });

  it('末尾に1件足したら、DOMの変更は追加1回だけ', () => {
    render(list(['貸出中']), container);

    const records = recordMutations(() => render(list(['貸出中', '貸出中']), container));

    expect(records.map((record) => [record.type, record.addedNodes.length, record.removedNodes.length])).toEqual([
      ['childList', 1, 0],
    ]);
  });
});
