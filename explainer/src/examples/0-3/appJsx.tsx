/** @jsxRuntime classic */
/** @jsx h */
import { h, render, type VNode } from './miniReact';

type Loan = { id: number; itemName: string; status: 'lent' | 'returned' };

// app.ts と同じ貸出一覧を、JSXで書いたもの。JSXは、実行前に h() の呼び出しに変換される。
export function startAppJsx(root: HTMLElement): void {
  let loans: Loan[] = [
    { id: 1, itemName: 'リーダブルコード', status: 'lent' },
    { id: 2, itemName: 'プロジェクター', status: 'lent' },
    { id: 3, itemName: 'HDMIケーブル', status: 'returned' },
  ];
  let nextId = 4;

  function setLoans(next: Loan[]) {
    loans = next;
    render(view(), root);
  }

  function addToTop() {
    setLoans([{ id: nextId, itemName: `新しい備品${nextId}`, status: 'lent' }, ...loans]);
    nextId += 1;
  }

  function toggleStatus(id: number) {
    setLoans(
      loans.map((loan) => (loan.id === id ? { ...loan, status: loan.status === 'lent' ? 'returned' : 'lent' } : loan)),
    );
  }

  function view(): VNode {
    const lentCount = loans.filter((loan) => loan.status === 'lent').length;

    return (
      <div>
        <p>
          <button type="button" onClick={addToTop}>
            先頭に1件追加
          </button>
        </p>
        <p className="loan-summary">
          全{loans.length}件・貸出中{lentCount}件
        </p>
        <table>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.itemName}</td>
                <td>{loan.status === 'lent' ? '貸出中' : '返却済'}</td>
                <td>
                  <input size={10} aria-label={`${loan.itemName}のメモ`} />
                </td>
                <td>
                  <button
                    type="button"
                    aria-label={`${loan.itemName}の状態を切り替える`}
                    onClick={() => toggleStatus(loan.id)}
                  >
                    状態を切り替える
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  render(view(), root);
}
