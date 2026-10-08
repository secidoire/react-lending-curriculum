import { describe, expect, it } from 'vitest';
import {
  addCounts,
  addLoan,
  countMutations,
  emptyCounts,
  formatCounts,
  formatFocus,
  initialState,
  toggleFirstStatus,
} from './logic';

describe('状態の変更', () => {
  it('addLoan は最後に1件足し、元の状態は変えない', () => {
    const next = addLoan(initialState);

    expect(next.loans).toHaveLength(6);
    expect(next.loans.at(-1)).toEqual({ id: 6, itemName: '備品6', status: 'lent' });
    expect(initialState.loans).toHaveLength(5);
  });

  it('toggleFirstStatus は1行目だけを切り替え、ほかの行は同じオブジェクトのまま', () => {
    const next = toggleFirstStatus(initialState);

    expect(next.loans[0]?.status).toBe('returned');
    expect(next.loans[1]).toBe(initialState.loans[1]);
    expect(toggleFirstStatus(next).loans[0]?.status).toBe('lent');
  });

  it('toggleFirstStatus は、行がなければ何もしない', () => {
    const empty = { loans: [], nextId: 1 };

    expect(toggleFirstStatus(empty)).toBe(empty);
  });
});

describe('DOMの変更を数える', () => {
  it('種類ごとに数える', () => {
    const counts = countMutations([
      { type: 'childList', addedNodes: { length: 5 }, removedNodes: { length: 2 } },
      { type: 'attributes', addedNodes: { length: 0 }, removedNodes: { length: 0 } },
      { type: 'characterData', addedNodes: { length: 0 }, removedNodes: { length: 0 } },
      { type: 'characterData', addedNodes: { length: 0 }, removedNodes: { length: 0 } },
    ]);

    expect(counts).toEqual({ added: 5, removed: 2, attributes: 1, text: 2 });
  });

  it('足し合わせて、文にできる', () => {
    const total = addCounts({ added: 1, removed: 0, attributes: 0, text: 2 }, { added: 4, removed: 5, attributes: 1, text: 0 });

    expect(formatCounts(total)).toBe('追加 5・削除 5・属性 1・文字 2');
    expect(formatCounts(emptyCounts)).toBe('追加 0・削除 0・属性 0・文字 0');
  });
});

describe('formatFocus', () => {
  it('フォーカスのある入力欄の名前を出す。なければ「なし」', () => {
    expect(formatFocus('メモ欄3')).toBe('フォーカス：メモ欄3');
    expect(formatFocus(null)).toBe('フォーカス：なし');
  });
});
