import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import * as solution from '../solution/rows.js';
import * as starter from '../starter/rows.js';

// ふだんは solution を、`npm run test:starter` のときは starter（自分のコード）を確かめる。
const target = import.meta.env.MODE === 'starter' ? starter : solution;

const items = [
  { name: 'リーダブルコード', borrower: '佐藤', status: '貸出中' },
  { name: 'プロジェクター', borrower: '鈴木', status: '予約中' },
  { name: 'HDMIケーブル', borrower: '高橋', status: '返却済' },
];

let tbody: HTMLTableSectionElement;

beforeEach(() => {
  const table = document.createElement('table');
  tbody = table.createTBody();
  document.body.append(table);
});

afterEach(() => {
  document.body.replaceChildren();
});

function rowTexts(): string[][] {
  return [...tbody.rows].map((row) => [...row.cells].map((cell) => cell.textContent));
}

// fn の実行中に、tbody への子の追加・削除が何回の操作として行われたかを数える。
function countChildListChanges(fn: () => void): number {
  const observer = new MutationObserver(() => {});
  observer.observe(tbody, { childList: true });
  fn();
  const records = observer.takeRecords();
  observer.disconnect();
  return records.length;
}

describe.each([
  ['appendOneByOne', target.appendOneByOne],
  ['appendWithFragment', target.appendWithFragment],
  ['appendWithLayoutRead', target.appendWithLayoutRead],
])('%s', (_name, append) => {
  it('渡した順に、1件につき1行を追加する', () => {
    append(tbody, items);

    expect(rowTexts()).toEqual([
      ['リーダブルコード', '佐藤', '貸出中'],
      ['プロジェクター', '鈴木', '予約中'],
      ['HDMIケーブル', '高橋', '返却済'],
    ]);
  });

  it('すでにある行は消さず、その後ろに追加する', () => {
    tbody.insertRow().insertCell().textContent = '先にあった行';

    append(tbody, items);

    expect(tbody.rows).toHaveLength(4);
    expect(tbody.rows[0]?.textContent).toBe('先にあった行');
  });
});

describe('追加のしかたの違い', () => {
  it('appendOneByOne は、行の数だけ tbody を変更する', () => {
    expect(countChildListChanges(() => target.appendOneByOne(tbody, items))).toBe(3);
  });

  it('appendWithFragment は、tbody を1回だけ変更する', () => {
    expect(countChildListChanges(() => target.appendWithFragment(tbody, items))).toBe(1);
  });

  it('appendWithLayoutRead は、1行追加するたびに tbody.offsetHeight を読む', () => {
    const rowCountsWhenRead: number[] = [];
    Object.defineProperty(tbody, 'offsetHeight', {
      get: () => {
        rowCountsWhenRead.push(tbody.rows.length);
        return 0;
      },
    });

    target.appendWithLayoutRead(tbody, items);

    expect(rowCountsWhenRead).toEqual([1, 2, 3]);
  });
});
