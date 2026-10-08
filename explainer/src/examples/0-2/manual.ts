import { createFrame, createRow, readNewLoan } from './frame';
import { initialLoans, summaryText, type Loan, type LoanStatus } from './loans';

// A版：操作のたびに、変わったところだけをDOMに書き足す・消す。
export function startManual(root: HTMLElement): void {
  const { form, lentOnly, summary, tbody } = createFrame(root);
  const loans = [...initialLoans];
  let nextId = loans.length + 1;

  function isHiddenByFilter(status: LoanStatus): boolean {
    return lentOnly.checked && status !== 'lent';
  }

  function updateSummary() {
    summary.textContent = summaryText(loans);
  }

  function addRow(loan: Loan) {
    const { row, deleteButton } = createRow(loan);
    // 絞り込みのときに行から状態を引けるよう、DOM側にも状態を持たせる。
    // 同じ情報が配列とDOMの2か所にあることになる。
    row.dataset.status = loan.status;
    // 絞り込み中に「貸出中」でない貸出を足したときは、隠した状態で追加する。
    row.hidden = isHiddenByFilter(loan.status);
    tbody.append(row);

    deleteButton.addEventListener('click', () => {
      // 削除で直す場所は3つ：配列・行・件数。
      loans.splice(loans.indexOf(loan), 1);
      row.remove();
      updateSummary();
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const loan = readNewLoan(form, `loan-${nextId}`);
    nextId += 1;

    // 追加で直す場所は4つ：配列・行・絞り込み・件数。
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
