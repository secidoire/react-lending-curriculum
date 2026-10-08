// 教材用の悪い例：操作ごとにDOMを直す書き方で、直し忘れが2か所ある。
// （削除しても件数が変わらない。絞り込み中に追加した「予約中」の行が表示される）
import { initialLoans, STATUS_LABELS } from './data.js';

export function startApp() {
  const loans = [...initialLoans];
  let nextId = loans.length + 1;

  const form = document.querySelector('#add-form');
  const lentOnly = document.querySelector('#lent-only');
  const summary = document.querySelector('#summary');
  const tbody = document.querySelector('#loan-rows');

  function updateSummary() {
    const lentCount = loans.filter((loan) => loan.status === 'lent').length;
    summary.textContent = `全${loans.length}件・貸出中${lentCount}件`;
  }

  function createRow(loan) {
    const row = document.createElement('tr');
    row.dataset.status = loan.status;

    for (const text of [loan.itemName, loan.userName, STATUS_LABELS[loan.status]]) {
      const cell = document.createElement('td');
      cell.textContent = text;
      row.append(cell);
    }

    const memo = document.createElement('input');
    memo.setAttribute('aria-label', `${loan.itemName}のメモ`);
    const memoCell = document.createElement('td');
    memoCell.append(memo);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = '削除';
    deleteButton.setAttribute('aria-label', `${loan.itemName}を削除`);
    deleteButton.addEventListener('click', () => {
      loans.splice(loans.indexOf(loan), 1);
      row.remove();
      // 直し忘れ1：件数を数え直していない。
    });
    const deleteCell = document.createElement('td');
    deleteCell.append(deleteButton);

    row.append(memoCell, deleteCell);
    return row;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = new FormData(form);
    const loan = {
      id: `loan-${nextId}`,
      itemName: input.get('itemName'),
      userName: input.get('userName'),
      status: input.get('status'),
    };
    nextId += 1;

    loans.push(loan);
    // 直し忘れ2：絞り込み中かどうかを見ずに、そのまま表示している。
    tbody.append(createRow(loan));
    updateSummary();

    form.reset();
  });

  lentOnly.addEventListener('change', () => {
    for (const row of tbody.rows) {
      row.hidden = lentOnly.checked && row.dataset.status !== 'lent';
    }
  });

  for (const loan of loans) {
    tbody.append(createRow(loan));
  }
  updateSummary();
}
