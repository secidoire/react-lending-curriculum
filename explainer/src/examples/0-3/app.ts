import { h, render, type VNode } from './miniReact';

type Loan = { id: number; itemName: string; status: 'lent' | 'returned' };

// 0-2のB版と同じ考え方の貸出一覧。操作ではデータだけを直し、画面は view() から作る。
export function startApp(root: HTMLElement): void {
  // 画面を決めるデータ。
  let loans: Loan[] = [
    { id: 1, itemName: 'リーダブルコード', status: 'lent' },
    { id: 2, itemName: 'プロジェクター', status: 'lent' },
    { id: 3, itemName: 'HDMIケーブル', status: 'returned' },
  ];
  let nextId = 4;

  // データを新しいものに替えて、画面を描き直す。
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

  // いまのデータから、画面全体を表すオブジェクトを作る。DOMには触らない。
  function view(): VNode {
    const lentCount = loans.filter((loan) => loan.status === 'lent').length;

    return h(
      'div',
      null,
      h('p', null, h('button', { type: 'button', onClick: addToTop }, '先頭に1件追加')),
      h('p', { className: 'loan-summary' }, `全${loans.length}件・貸出中${lentCount}件`),
      h(
        'table',
        null,
        h(
          'tbody',
          null,
          loans.map((loan) =>
            h(
              'tr',
              null,
              h('td', null, loan.itemName),
              h('td', null, loan.status === 'lent' ? '貸出中' : '返却済'),
              h('td', null, h('input', { size: 10, 'aria-label': `${loan.itemName}のメモ` })),
              h(
                'td',
                null,
                h(
                  'button',
                  { type: 'button', 'aria-label': `${loan.itemName}の状態を切り替える`, onClick: () => toggleStatus(loan.id) },
                  '状態を切り替える',
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  render(view(), root);
}
