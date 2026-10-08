export type Loan = { id: number; itemName: string; status: 'lent' | 'returned' };

// どの関数も、渡された配列やオブジェクトを書き換えない。変えたい部分だけを新しく作って返す。

export function addLoan(loans: readonly Loan[], loan: Loan): Loan[] {
  return [...loans, loan];
}

export function removeLoan(loans: readonly Loan[], id: number): Loan[] {
  return loans.filter((loan) => loan.id !== id);
}

export function returnLoan(loans: readonly Loan[], id: number): Loan[] {
  // 変える1件だけ、中身をコピーした新しいオブジェクトにする。ほかの行は、同じオブジェクトをそのまま使う。
  return loans.map((loan) => (loan.id === id ? { ...loan, status: 'returned' } : loan));
}
