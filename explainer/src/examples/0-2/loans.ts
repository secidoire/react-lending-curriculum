export type LoanStatus = 'reserved' | 'lent' | 'returned';

// この回だけの、いちばん単純な貸出データ。
export type Loan = {
  id: string;
  itemName: string;
  userName: string;
  status: LoanStatus;
};

export const STATUS_LABELS: Record<LoanStatus, string> = {
  reserved: '予約中',
  lent: '貸出中',
  returned: '返却済',
};

export const initialLoans: readonly Loan[] = [
  { id: 'loan-1', itemName: 'リーダブルコード', userName: '佐藤', status: 'lent' },
  { id: 'loan-2', itemName: 'プロジェクター', userName: '鈴木', status: 'reserved' },
  { id: 'loan-3', itemName: 'HDMIケーブル', userName: '高橋', status: 'returned' },
];

export function summaryText(loans: readonly Loan[]): string {
  const lentCount = loans.filter((loan) => loan.status === 'lent').length;
  return `全${loans.length}件・貸出中${lentCount}件`;
}
