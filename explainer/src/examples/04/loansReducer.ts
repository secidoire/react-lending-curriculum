import { assertNever, lend, returnLoan, type IsoDate, type Loan, type Result } from './loan';

export type LoansState = {
  loans: readonly Loan[];
  /** 直前の操作ができなかったときの理由。できたときは null */
  error: string | null;
};

// 「何が起きたか」を表す値。画面は、これを dispatch で伝えるだけ。
export type LoansAction =
  | { type: 'lent'; loanId: string; today: IsoDate }
  | { type: 'returned'; loanId: string; today: IsoDate };

function transition(loan: Loan, action: LoansAction): Result {
  switch (action.type) {
    case 'lent':
      return lend(loan, action.today);
    case 'returned':
      return returnLoan(loan, action.today);
    default:
      return assertNever(action);
  }
}

// いまの state と、起きたことから、次の state を作る。決まりそのものは loan.ts にあり、ここではそれを呼ぶだけ。
export function loansReducer(state: LoansState, action: LoansAction): LoansState {
  const target = state.loans.find((loan) => loan.id === action.loanId);
  if (target === undefined) return { ...state, error: '貸出が見つかりません' };

  const result = transition(target, action);
  if (!result.ok) return { ...state, error: result.reason };

  return { loans: state.loans.map((loan) => (loan.id === target.id ? result.loan : loan)), error: null };
}
