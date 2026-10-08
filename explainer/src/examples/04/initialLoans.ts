import type { Loan } from './loan';

export const initialItems = [
  { id: 'item-1', name: 'リーダブルコード' },
  { id: 'item-2', name: 'プロジェクター' },
  { id: 'item-3', name: 'HDMIケーブル' },
];

// 「今日」は 2026-10-20 として動かす。2件目は、期限（10/17）を過ぎている。
export const initialLoans: readonly Loan[] = [
  { id: 'loan-1', itemId: 'item-2', userName: '佐藤', status: 'reserved', reservedFrom: '2026-10-20', reservedTo: '2026-10-22' },
  { id: 'loan-2', itemId: 'item-1', userName: '鈴木', status: 'lent', lentAt: '2026-10-10', dueDate: '2026-10-17' },
  { id: 'loan-3', itemId: 'item-3', userName: '高橋', status: 'lent', lentAt: '2026-10-18', dueDate: '2026-10-25' },
];
