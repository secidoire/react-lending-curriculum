import { beforeEach, describe, expect, it } from 'vitest';
import { appendOneByOne, appendWithFragment, appendWithLayoutRead, makeItems } from './appendRows';

const items = makeItems(3);
let tbody: HTMLTableSectionElement;

beforeEach(() => {
  const table = document.createElement('table');
  tbody = table.createTBody();
  document.body.replaceChildren(table);
});

// fn の実行中に、tbody への子の追加が何回の操作として行われたかを数える。
function countChildListChanges(fn: () => void): number {
  const observer = new MutationObserver(() => {});
  observer.observe(tbody, { childList: true });
  fn();
  const records = observer.takeRecords();
  observer.disconnect();
  return records.length;
}

describe.each([
  ['appendOneByOne', appendOneByOne],
  ['appendWithFragment', appendWithFragment],
  ['appendWithLayoutRead', appendWithLayoutRead],
])('%s', (_name, append) => {
  it('渡した順に、1件につき1行を追加する', () => {
    append(tbody, items);

    expect([...tbody.rows].map((row) => row.cells[0]?.textContent)).toEqual(['備品1', '備品2', '備品3']);
  });
});

describe('追加のしかたの違い', () => {
  it('appendOneByOne は、行の数だけ表を変更する', () => {
    expect(countChildListChanges(() => appendOneByOne(tbody, items))).toBe(3);
  });

  it('appendWithFragment は、表を1回だけ変更する', () => {
    expect(countChildListChanges(() => appendWithFragment(tbody, items))).toBe(1);
  });

  it('appendWithLayoutRead は、1行追加するたびに高さを読む', () => {
    const rowCountsWhenRead: number[] = [];
    Object.defineProperty(tbody, 'offsetHeight', {
      get: () => {
        rowCountsWhenRead.push(tbody.rows.length);
        return 0;
      },
    });

    appendWithLayoutRead(tbody, items);

    expect(rowCountsWhenRead).toEqual([1, 2, 3]);
  });
});
