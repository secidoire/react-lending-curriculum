import { find } from '../find';

const HTML = `
  <table>
    <tr><th class="item-column">備品</th><th>借りている人</th><th>状態</th></tr>
    <tr class="first-row"><td>リーダブルコード</td><td>佐藤</td><td>貸出中</td></tr>
    <tr><td>プロジェクター</td><td>鈴木</td><td>予約中</td></tr>
    <tr><td>HDMIケーブル</td><td>高橋</td><td>返却済</td></tr>
  </table>
  <p>
    <button type="button" class="change-color">1行目の色を変える</button>
    <button type="button" class="change-width">備品の列の幅を変える</button>
  </p>
`;

// 「色を変える」と「幅を変える」を試すための小さな表。
export function startColorAndWidth(root: HTMLElement): void {
  root.innerHTML = HTML;
  const firstRow = find(root, '.first-row', HTMLTableRowElement);
  const itemColumn = find(root, '.item-column', HTMLTableCellElement);

  find(root, '.change-color', HTMLButtonElement).addEventListener('click', () => {
    firstRow.classList.toggle('colored');
  });
  find(root, '.change-width', HTMLButtonElement).addEventListener('click', () => {
    itemColumn.classList.toggle('wide');
  });
}
