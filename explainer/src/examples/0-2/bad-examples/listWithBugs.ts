// 教材用の悪い例：操作ごとにDOMを直す書き方で、直し忘れが2か所ある。
// （削除しても件数が変わらない。絞り込み中に追加した「予約中」の行が表示される）
import { createFrame, createRow, readNewLoan } from '../frame';
import { initialLoans, summaryText, type Loan } from '../loans';

export function startListWithBugs(root: HTMLElement): void {
  const { form, lentOnly, summary, tbody } = createFrame(root);
  const loans = [...initialLoans];
  let nextId = loans.length + 1;

  function updateSummary() {
    summary.textContent = summaryText(loans);
  }

  function addRow(loan: Loan) {
    const { row, deleteButton } = createRow(loan);
    row.dataset.status = loan.status;
    // 直し忘れ2：絞り込み中かどうかを見ずに、そのまま表示している。
    tbody.append(row);

    deleteButton.addEventListener('click', () => {
      loans.splice(loans.indexOf(loan), 1);
      row.remove();
      // 直し忘れ1：件数を数え直していない。
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const loan = readNewLoan(form, `loan-${nextId}`);
    nextId += 1;

    loans.push(loan);
    addRow(loan);
    updateSummary();

    form.reset();
  });

  lentOnly.addEventListener('change', () => {
    for (const row of tbody.rows) {
      row.hidden = lentOnly.checked && row.dataset.status !== 'lent';
    }
  });

  for (const loan of loans) addRow(loan);
  updateSummary();
}
