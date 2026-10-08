// 教材用の悪い例。何が問題かは、解説ページの本文で考える（ここには答えを書かない）。
import { useState } from 'react';

type Loan = {
  id: string;
  itemName: string;
  userName: string;
  status: string;
  dueDate?: string;
  returnedAt?: string;
  overdue?: boolean;
};

const TODAY = '2026-10-20';

const STATUS_LABELS: Record<string, string> = { reserved: '予約中', lent: '貸出中', returned: '返却済' };

const initialLoans: Loan[] = [
  { id: 'loan-1', itemName: 'プロジェクター', userName: '佐藤', status: 'reserved' },
  { id: 'loan-2', itemName: 'リーダブルコード', userName: '鈴木', status: 'lent', dueDate: '2026-10-17' },
  { id: 'loan-3', itemName: 'HDMIケーブル', userName: '高橋', status: 'lent', dueDate: '2026-10-25' },
];

export function LooseLoans() {
  const [itemNames, setItemNames] = useState(['リーダブルコード', 'プロジェクター', 'HDMIケーブル']);
  const [loans, setLoans] = useState(initialLoans);

  function update(id: string, changes: Partial<Loan>) {
    setLoans(loans.map((loan) => (loan.id === id ? { ...loan, ...changes } : loan)));
  }

  function checkOverdue() {
    setLoans(loans.map((loan) => (loan.status === 'lent' && TODAY > (loan.dueDate ?? '') ? { ...loan, overdue: true } : loan)));
  }

  function renameProjector() {
    setItemNames(itemNames.map((name) => (name === 'プロジェクター' ? 'プロジェクター（新型）' : name)));
  }

  return (
    <div>
      <p>
        今日：{TODAY}{' '}
        <button type="button" onClick={checkOverdue}>
          延滞を確認する
        </button>{' '}
        <button type="button" onClick={renameProjector}>
          「プロジェクター」を改名する
        </button>
      </p>
      <p>備品：{itemNames.join('、')}</p>
      <table>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td>{loan.itemName}</td>
              <td>{loan.userName}さん</td>
              <td>
                {STATUS_LABELS[loan.status]}
                {loan.status === 'lent' && `（期限 ${loan.dueDate}）`}
                {loan.status === 'returned' && `（${loan.returnedAt ?? '返却日の記録なし'}）`}{' '}
                {loan.overdue && <strong className="overdue">延滞</strong>}
              </td>
              <td>
                {loan.status === 'reserved' && (
                  <button type="button" aria-label={`${loan.itemName}を貸出にする`} onClick={() => update(loan.id, { status: 'lent', dueDate: '2026-10-22' })}>
                    貸出にする
                  </button>
                )}{' '}
                {loan.status !== 'returned' && (
                  <button type="button" aria-label={`${loan.itemName}を返却する`} onClick={() => update(loan.id, { status: 'returned' })}>
                    返却する
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
