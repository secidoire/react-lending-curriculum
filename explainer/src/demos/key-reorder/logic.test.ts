import { describe, expect, it } from 'vitest';
import { describeKey, initialItems, isMisaligned, prepend, reverse, shuffle } from './logic';

const names = (items: readonly { name: string }[]) => items.map((item) => item.name);

describe('並べ替えの操作', () => {
  it('prepend は先頭に1件足し、元の配列は変えない', () => {
    const next = prepend(initialItems, 5);

    expect(names(next)).toEqual(['備品5', 'リーダブルコード', 'プロジェクター', 'HDMIケーブル', '延長コード']);
    expect(next[0]?.id).toBe('item-5');
    expect(initialItems).toHaveLength(4);
  });

  it('reverse は逆順にし、元の配列は変えない', () => {
    expect(names(reverse(initialItems))).toEqual(['延長コード', 'HDMIケーブル', 'プロジェクター', 'リーダブルコード']);
    expect(names(initialItems)[0]).toBe('リーダブルコード');
  });

  it('shuffle は、同じ乱数なら同じ結果になり、中身は増減しない', () => {
    const shuffled = shuffle(initialItems, () => 0);

    expect(shuffled).toEqual(shuffle(initialItems, () => 0));
    expect(names(shuffled)).not.toEqual(names(initialItems));
    expect([...names(shuffled)].sort()).toEqual([...names(initialItems)].sort());
  });
});

describe('describeKey', () => {
  it('モードごとに、keyに使っている値を説明する', () => {
    const item = { id: 'item-3', name: 'HDMIケーブル' };

    expect(describeKey('none', item, 2)).toBe('key なし');
    expect(describeKey('index', item, 2)).toBe('key=2');
    expect(describeKey('id', item, 2)).toBe('key=item-3');
  });
});

describe('isMisaligned', () => {
  it('作られたときと違う備品を表示していたら「ずれ」', () => {
    expect(isMisaligned('リーダブルコード', 'リーダブルコード')).toBe(false);
    expect(isMisaligned('リーダブルコード', '備品5')).toBe(true);
  });
});
