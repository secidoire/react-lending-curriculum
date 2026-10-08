// 'YYYY-MM-DD' の形の日付。この形の文字列は、文字列のまま比べても日付の前後と一致する。
export type IsoDate = string;

type LoanBase = { id: string; itemId: string; userName: string };

// 貸出。状態（status）ごとに、持っている項目が違う。
export type Loan =
  | (LoanBase & { status: 'reserved'; reservedFrom: IsoDate; reservedTo: IsoDate })
  | (LoanBase & { status: 'lent'; lentAt: IsoDate; dueDate: IsoDate })
  | (LoanBase & { status: 'returned'; lentAt: IsoDate; dueDate: IsoDate; returnedAt: IsoDate });

export type Result = { ok: true; loan: Loan } | { ok: false; reason: string };

// 予約中 → 貸出中。それ以外の状態からは、貸出にできない。
export function lend(loan: Loan, today: IsoDate): Result {
  if (loan.status !== 'reserved') {
    return { ok: false, reason: '貸出にできるのは、予約中のものだけです' };
  }
  const { id, itemId, userName } = loan;
  return { ok: true, loan: { id, itemId, userName, status: 'lent', lentAt: today, dueDate: loan.reservedTo } };
}

// 貸出中 → 返却済。それ以外の状態からは、返却できない。
export function returnLoan(loan: Loan, today: IsoDate): Result {
  if (loan.status !== 'lent') {
    return { ok: false, reason: '返却できるのは、貸出中のものだけです' };
  }
  const { id, itemId, userName, lentAt, dueDate } = loan;
  return { ok: true, loan: { id, itemId, userName, status: 'returned', lentAt, dueDate, returnedAt: today } };
}

// 延滞は、状態として持たない。貸出中で、今日が期限を過ぎていれば延滞。
export function isOverdue(loan: Loan, today: IsoDate): boolean {
  return loan.status === 'lent' && today > loan.dueDate;
}

export function describeLoan(loan: Loan): string {
  switch (loan.status) {
    case 'reserved':
      return `予約中（${loan.reservedFrom} 〜 ${loan.reservedTo}）`;
    case 'lent':
      return `貸出中（期限 ${loan.dueDate}）`;
    case 'returned':
      return `返却済（${loan.returnedAt} に返却）`;
    default:
      return assertNever(loan);
  }
}

// describeLoan などの switch の default で使う。
export function assertNever(value: never): never {
  throw new Error(`想定していない状態です：${JSON.stringify(value)}`);
}
