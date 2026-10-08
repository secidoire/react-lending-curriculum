// 貸出の状態と、画面に出す名前の対応。
export const STATUS_LABELS = {
  reserved: '予約中',
  lent: '貸出中',
  returned: '返却済',
};

// ページを開いたときに入っている貸出。
export const initialLoans = [
  { id: 'loan-1', itemName: 'リーダブルコード', userName: '佐藤', status: 'lent' },
  { id: 'loan-2', itemName: 'プロジェクター', userName: '鈴木', status: 'reserved' },
  { id: 'loan-3', itemName: 'HDMIケーブル', userName: '高橋', status: 'returned' },
];
