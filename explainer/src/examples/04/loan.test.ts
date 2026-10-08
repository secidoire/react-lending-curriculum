import { describe, expect, it } from 'vitest';
import { describeLoan, isOverdue, lend, returnLoan, type Loan } from './loan';

const base = { id: 'loan-1', itemId: 'item-2', userName: '佐藤' };
const reserved: Loan = { ...base, status: 'reserved', reservedFrom: '2026-10-20', reservedTo: '2026-10-22' };
const lent: Loan = { ...base, status: 'lent', lentAt: '2026-10-20', dueDate: '2026-10-22' };
const returned: Loan = { ...lent, status: 'returned', returnedAt: '2026-10-21' };

describe('lend', () => {
  it('予約中を貸出中にする。期限は、予約の最終日になる', () => {
    expect(lend(reserved, '2026-10-20')).toEqual({ ok: true, loan: lent });
  });

  it('予約のときの項目（reservedFrom など）は、貸出中の値に残さない', () => {
    const result = lend(reserved, '2026-10-20');

    expect(result.ok && Object.keys(result.loan).sort()).toEqual(['dueDate', 'id', 'itemId', 'lentAt', 'status', 'userName']);
  });

  it.each([lent, returned])('予約中でなければ、理由を返して何も変えない（$status）', (loan) => {
    expect(lend(loan, '2026-10-20')).toEqual({ ok: false, reason: '貸出にできるのは、予約中のものだけです' });
  });
});

describe('returnLoan', () => {
  it('貸出中を返却済にする。返却日が必ず入る', () => {
    expect(returnLoan(lent, '2026-10-21')).toEqual({ ok: true, loan: returned });
  });

  it.each([reserved, returned])('貸出中でなければ、理由を返して何も変えない（$status）', (loan) => {
    expect(returnLoan(loan, '2026-10-21')).toEqual({ ok: false, reason: '返却できるのは、貸出中のものだけです' });
  });
});

describe('isOverdue', () => {
  it('貸出中で、今日が期限より後なら延滞。期限の当日は延滞ではない', () => {
    expect(isOverdue(lent, '2026-10-22')).toBe(false);
    expect(isOverdue(lent, '2026-10-23')).toBe(true);
  });

  it('予約中と返却済は、いつ見ても延滞ではない', () => {
    expect(isOverdue(reserved, '2026-12-31')).toBe(false);
    expect(isOverdue(returned, '2026-12-31')).toBe(false);
  });
});

describe('describeLoan', () => {
  it('状態ごとに、その状態が持つ項目を使って説明する', () => {
    expect(describeLoan(reserved)).toBe('予約中（2026-10-20 〜 2026-10-22）');
    expect(describeLoan(lent)).toBe('貸出中（期限 2026-10-22）');
    expect(describeLoan(returned)).toBe('返却済（2026-10-21 に返却）');
  });
});
