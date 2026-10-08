import { describe, expect, it } from 'vitest';
import { initialLoans } from './initialLoans';
import { loansReducer, type LoansState } from './loansReducer';

const initial: LoansState = { loans: initialLoans, error: null };
const today = '2026-10-20';

describe('loansReducer', () => {
  it('予約中の貸出を、貸出中にする。ほかの貸出は同じオブジェクトのまま', () => {
    const next = loansReducer(initial, { type: 'lent', loanId: 'loan-1', today });

    expect(next.loans[0]).toMatchObject({ status: 'lent', lentAt: today, dueDate: '2026-10-22' });
    expect(next.loans[1]).toBe(initial.loans[1]);
    expect(next.error).toBeNull();
  });

  it('貸出中の貸出を、返却済にする', () => {
    const next = loansReducer(initial, { type: 'returned', loanId: 'loan-2', today });

    expect(next.loans[1]).toMatchObject({ status: 'returned', returnedAt: today });
  });

  it('できない操作（予約中をいきなり返却）は、貸出を変えずに、理由だけを入れる', () => {
    const next = loansReducer(initial, { type: 'returned', loanId: 'loan-1', today });

    expect(next.loans).toBe(initial.loans);
    expect(next.error).toBe('返却できるのは、貸出中のものだけです');
  });

  it('次の操作ができたら、理由は消える', () => {
    const failed = loansReducer(initial, { type: 'returned', loanId: 'loan-1', today });

    expect(loansReducer(failed, { type: 'lent', loanId: 'loan-1', today }).error).toBeNull();
  });

  it('渡した state は書き換えない', () => {
    const before = JSON.stringify(initial);

    loansReducer(initial, { type: 'returned', loanId: 'loan-2', today });

    expect(JSON.stringify(initial)).toBe(before);
  });
});
