import { find } from '../find';
import { appendOneByOne, appendWithFragment, appendWithLayoutRead, makeItems, measure } from './appendRows';

const METHODS = [
  { label: '方法1：1行ずつ追加', append: appendOneByOne },
  { label: '方法2：まとめて追加', append: appendWithFragment },
  { label: '方法3：1行ずつ追加し、毎回高さを読む', append: appendWithLayoutRead },
];

const HTML = `
  <table>
    <thead><tr><th>方法（押すと測る）</th><th>かかった時間</th></tr></thead>
    <tbody class="results"></tbody>
  </table>
  <p>追加された表（スクロールできます）</p>
  <div style="max-height: 8em; overflow-y: auto; border: 1px solid #d0d7de;">
    <table><tbody class="rows"></tbody></table>
  </div>
`;

// 3つの方法のボタンを並べ、押すたびに「表を空にする → 1000行を追加する → かかった時間を記録する」を行う。
export function startBenchmark(root: HTMLElement): void {
  root.innerHTML = HTML;
  const results = find(root, '.results', HTMLTableSectionElement);
  const rows = find(root, '.rows', HTMLTableSectionElement);
  const items = makeItems(1000);

  for (const method of METHODS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = method.label;

    const resultRow = results.insertRow();
    resultRow.insertCell().append(button);
    const times = resultRow.insertCell();
    times.textContent = 'まだ測っていません';

    let runCount = 0;
    button.addEventListener('click', () => {
      rows.replaceChildren();
      const ms = measure(() => method.append(rows, items));

      runCount += 1;
      const text = `${ms.toFixed(1)} ms`;
      times.textContent = runCount === 1 ? text : `${times.textContent} / ${text}`;
    });
  }
}
