import { initialLoans, STATUS_LABELS } from './data.js';

// B版：操作ではデータだけを直し、画面は render() で毎回すべて作り直す。
export function startApp() {
  // 画面を決めるデータは、この2つだけ。
  let loans = [...initialLoans];
  let lentOnly = false;
  let nextId = loans.length + 1;

  const form = document.querySelector('#add-form');
  const lentOnlyCheckbox = document.querySelector('#lent-only');
  const summary = document.querySelector('#summary');
  const tbody = document.querySelector('#loan-rows');

  function createRow(loan) {
    const row = document.createElement('tr');

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
      loans = loans.filter((other) => other !== loan);
      render();
    });
    const deleteCell = document.createElement('td');
    deleteCell.append(deleteButton);

    row.append(memoCell, deleteCell);
    return row;
  }

  // 絞り込みも件数も、いまのデータから毎回計算する。操作ごとに直す場所を覚えておく必要がない。
  function render() {
    const lentLoans = loans.filter((loan) => loan.status === 'lent');
    const visibleLoans = lentOnly ? lentLoans : loans;

    summary.textContent = `全${loans.length}件・貸出中${lentLoans.length}件`;
    // 行をすべて捨てて作り直す。メモ欄も新しい要素になるので、入力中の文字とフォーカスは消える。
    tbody.replaceChildren(...visibleLoans.map(createRow));
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

    loans = [...loans, loan];
    render();

    form.reset();
  });

  lentOnlyCheckbox.addEventListener('change', () => {
    lentOnly = lentOnlyCheckbox.checked;
    render();
  });

  render();
}
