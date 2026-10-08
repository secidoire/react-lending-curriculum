import { createFrame, createRow, readNewLoan } from './frame';
import { initialLoans, summaryText, type Loan } from './loans';

// B版：操作ではデータだけを直し、画面は render() で毎回すべて作り直す。
export function startRerender(root: HTMLElement): void {
  const frame = createFrame(root);
  const { form, summary, tbody } = frame;

  // 画面を決めるデータは、この2つだけ。
  let loans = [...initialLoans];
  let lentOnly = false;
  let nextId = loans.length + 1;

  function createRowFor(loan: Loan): HTMLTableRowElement {
    const { row, deleteButton } = createRow(loan);
    deleteButton.addEventListener('click', () => {
      loans = loans.filter((other) => other !== loan);
      render();
    });
    return row;
  }

  // 絞り込みも件数も、いまのデータから毎回計算する。操作ごとに直す場所を覚えておく必要がない。
  function render() {
    const visibleLoans = lentOnly ? loans.filter((loan) => loan.status === 'lent') : loans;

    summary.textContent = summaryText(loans);
    // 行をすべて捨てて作り直す。メモ欄も新しい要素になるので、入力中の文字は消える。
    tbody.replaceChildren(...visibleLoans.map(createRowFor));
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const loan = readNewLoan(form, `loan-${nextId}`);
    nextId += 1;

    loans = [...loans, loan];
    render();

    form.reset();
  });

  frame.lentOnly.addEventListener('change', () => {
    lentOnly = frame.lentOnly.checked;
    render();
  });

  render();
}
