import { find } from '../find';
import { STATUS_LABELS, type Loan } from './loans';

// 3つの版（悪い例・A版・B版）で共通の部分。画面の枠、フォームの読み取り、1行ぶんの要素づくり。
// 版ごとの違い（操作のときに何を直すか）は、それぞれのファイルにある。

export type Frame = {
  form: HTMLFormElement;
  lentOnly: HTMLInputElement;
  summary: HTMLParagraphElement;
  tbody: HTMLTableSectionElement;
};

const FRAME_HTML = `
  <form class="loan-form">
    <label>備品名 <input name="itemName" required size="12" /></label>
    <label>借りる人 <input name="userName" required size="8" /></label>
    <select name="status" aria-label="状態">
      <option value="reserved">予約中</option>
      <option value="lent">貸出中</option>
    </select>
    <button type="submit">追加</button>
  </form>
  <label><input type="checkbox" class="lent-only" /> 貸出中のみ表示</label>
  <p class="loan-summary"></p>
  <table>
    <thead>
      <tr><th>備品</th><th>借りている人</th><th>状態</th><th>メモ</th><th>操作</th></tr>
    </thead>
    <tbody></tbody>
  </table>
`;

export function createFrame(root: HTMLElement): Frame {
  root.innerHTML = FRAME_HTML;
  return {
    form: find(root, 'form', HTMLFormElement),
    lentOnly: find(root, '.lent-only', HTMLInputElement),
    summary: find(root, '.loan-summary', HTMLParagraphElement),
    tbody: find(root, 'tbody', HTMLTableSectionElement),
  };
}

// フォームに入力された内容から、貸出を1件作る。
export function readNewLoan(form: HTMLFormElement, id: string): Loan {
  const input = new FormData(form);
  return {
    id,
    itemName: String(input.get('itemName') ?? ''),
    userName: String(input.get('userName') ?? ''),
    status: input.get('status') === 'lent' ? 'lent' : 'reserved',
  };
}

// 1件ぶんの行を作る。削除ボタンを押したときの処理は、版ごとに違うので呼び出し側が付ける。
export function createRow(loan: Loan): { row: HTMLTableRowElement; deleteButton: HTMLButtonElement } {
  const row = document.createElement('tr');

  for (const text of [loan.itemName, loan.userName, STATUS_LABELS[loan.status]]) {
    const cell = document.createElement('td');
    cell.textContent = text;
    row.append(cell);
  }

  const memo = document.createElement('input');
  memo.size = 10;
  memo.setAttribute('aria-label', `${loan.itemName}のメモ`);
  const memoCell = document.createElement('td');
  memoCell.append(memo);

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = '削除';
  deleteButton.setAttribute('aria-label', `${loan.itemName}を削除`);
  const deleteCell = document.createElement('td');
  deleteCell.append(deleteButton);

  row.append(memoCell, deleteCell);
  return { row, deleteButton };
}
