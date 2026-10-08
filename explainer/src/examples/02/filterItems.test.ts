import { describe, expect, it } from 'vitest';
import { filterItems, initialCriteria } from './filterItems';
import { initialItems } from './items';

const names = (items: readonly { name: string }[]) => items.map((item) => item.name);

describe('filterItems', () => {
  it('条件がなければ、全部をもとの順で返す', () => {
    expect(filterItems(initialItems, initialCriteria)).toEqual(initialItems);
  });

  it('名前の一部で絞り込む。大文字と小文字、前後の空白は区別しない', () => {
    expect(names(filterItems(initialItems, { ...initialCriteria, query: 'コード' }))).toEqual([
      'リーダブルコード',
      '延長コード',
    ]);
    expect(names(filterItems(initialItems, { ...initialCriteria, query: ' hdmi ' }))).toEqual(['HDMIケーブル']);
  });

  it('種類で絞り込む。名前の条件と両方を満たすものだけを返す', () => {
    expect(filterItems(initialItems, { ...initialCriteria, category: 'book' })).toHaveLength(2);
    expect(names(filterItems(initialItems, { ...initialCriteria, query: 'コード', category: 'book' }))).toEqual([
      'リーダブルコード',
    ]);
  });

  it('名前順に並べる。渡した配列は書き換えない', () => {
    const before = [...initialItems];

    const sorted = filterItems(initialItems, { ...initialCriteria, sortByName: true });

    expect(names(sorted)).toEqual([...names(initialItems)].sort((a, b) => a.localeCompare(b, 'ja')));
    expect(initialItems).toEqual(before);
  });
});
