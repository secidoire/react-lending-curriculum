import { initialLoans, STATUS_LABELS } from './data.js';

// A版：操作のたびに、変わったところだけをDOMに書き足す・消す。
export function startApp() {
  const loans = [...initialLoans];
  let nextId = loans.length + 1;

  const form = document.querySelector('#add-form');
  const lentOnly = document.querySelector('#lent-only');
  const summary = document.querySelector('#summary');
  const tbody = document.querySelector('#loan-rows');

  function isHiddenByFilter(status) {
    return lentOnly.checked && status !== 'lent';
  }

  function updateSummary() {
    const lentCount = loans.filter((loan) => loan.status === 'lent').length;
    summary.textContent = `全${loans.length}件・貸出中${lentCount}件`;
  }

  function createRow(loan) {
    const row = document.createElement('tr');
    // 絞り込みのときに行から状態を引けるよう、DOM側にも状態を持たせる。
    // 同じ情報が配列とDOMの2か所にあることになる。
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
      // 削除で直す場所は3つ：配列・行・件数。
      loans.splice(loans.indexOf(loan), 1);
      row.remove();
      updateSummary();
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

    // 追加で直す場所は4つ：配列・行・絞り込み・件数。
    loans.push(loan);
    const row = createRow(loan);
    // 絞り込み中に「貸出中」でない貸出を足したときは、隠した状態で追加する。
    row.hidden = isHiddenByFilter(loan.status);
    tbody.append(row);
    updateSummary();

    form.reset();
  });

  lentOnly.addEventListener('change', () => {
    for (const row of tbody.rows) {
      row.hidden = isHiddenByFilter(row.dataset.status);
    }
  });

  for (const loan of loans) {
    tbody.append(createRow(loan));
  }
  updateSummary();
}
