import { describe, expect, it } from 'vitest';
import { addLoan, removeLoan, returnLoan, type Loan } from './updates';

const loans: readonly Loan[] = [
  { id: 1, itemName: 'リーダブルコード', status: 'lent' },
  { id: 2, itemName: 'プロジェクター', status: 'lent' },
];

describe('イミュータブルな更新', () => {
  it('addLoan は、新しい配列を返し、元の配列は変えない', () => {
    const next = addLoan(loans, { id: 3, itemName: 'HDMIケーブル', status: 'lent' });

    expect(next).toHaveLength(3);
    expect(next).not.toBe(loans);
    expect(loans).toHaveLength(2);
  });

  it('removeLoan は、指定した1件を除いた新しい配列を返す', () => {
    const next = removeLoan(loans, 1);

    expect(next.map((loan) => loan.id)).toEqual([2]);
    expect(loans).toHaveLength(2);
  });

  it('returnLoan は、変えた1件だけを新しいオブジェクトにし、ほかは同じオブジェクトのまま返す', () => {
    const next = returnLoan(loans, 2);

    expect(next).not.toBe(loans);
    expect(next[0]).toBe(loans[0]);
    expect(next[1]).not.toBe(loans[1]);
    expect(next[1]?.status).toBe('returned');
    expect(loans[1]?.status).toBe('lent');
  });
});
