import { returnLoan, type Loan } from './updates';

// returnLoan の前と後で、どのオブジェクトが「同じ」で、どれが「新しい」かを表にする。
export function startCompareUpdates(root: HTMLElement): void {
  const before: Loan[] = [
    { id: 1, itemName: 'リーダブルコード', status: 'lent' },
    { id: 2, itemName: 'プロジェクター', status: 'lent' },
    { id: 3, itemName: 'HDMIケーブル', status: 'lent' },
  ];
  const after = returnLoan(before, 2);

  const describe = (same: boolean) => (same ? '同じもの' : '新しく作ったもの');

  const table = document.createElement('table');
  const header = table.insertRow();
  for (const text of ['', '前', '後', 'Object.is(前, 後)']) {
    const cell = document.createElement('th');
    cell.textContent = text;
    header.append(cell);
  }

  const arrayRow = table.insertRow();
  arrayRow.insertCell().textContent = '配列そのもの';
  arrayRow.insertCell().textContent = `${before.length}件`;
  arrayRow.insertCell().textContent = `${after.length}件`;
  arrayRow.insertCell().textContent = describe(Object.is(before, after));

  before.forEach((loan, index) => {
    const next = after[index];
    if (next === undefined) return;
    const row = table.insertRow();
    row.insertCell().textContent = loan.itemName;
    row.insertCell().textContent = loan.status;
    row.insertCell().textContent = next.status;
    row.insertCell().textContent = describe(Object.is(loan, next));
  });

  root.append(table);
}
