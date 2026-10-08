// 「同じ」かどうかを Object.is で確かめるクイズ。答えは、ボタンを押すまで隠しておく。
export function startObjectIs(root: HTMLElement): void {
  const a = ['リーダブルコード', 'プロジェクター'];
  const b = a;
  const c = ['リーダブルコード', 'プロジェクター'];
  const d = [...a];

  const questions: [string, boolean][] = [
    ['Object.is(3, 3)', Object.is(3, 3)],
    ["Object.is('貸出中', '貸出中')", Object.is('貸出中', '貸出中')],
    ['Object.is(a, b)　　※ b = a', Object.is(a, b)],
    ['Object.is(a, c)　　※ c は、a と同じ中身を書いた別の配列', Object.is(a, c)],
    ['Object.is(a, d)　　※ d = [...a]', Object.is(a, d)],
    ["Object.is({ status: 'lent' }, { status: 'lent' })", Object.is({ status: 'lent' }, { status: 'lent' })],
  ];

  // a に1件足してから、もう一度 b と比べる。
  a.push('HDMIケーブル');
  questions.push(['a.push(…) のあとで、Object.is(a, b)', Object.is(a, b)]);
  questions.push(['a.push(…) のあとの b.length', b.length === 3]);

  const table = document.createElement('table');
  const answerCells: HTMLTableCellElement[] = [];
  for (const [expression] of questions) {
    const row = table.insertRow();
    row.insertCell().textContent = expression;
    const answer = row.insertCell();
    answer.textContent = '？';
    answerCells.push(answer);
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = '答えを表示';
  button.addEventListener('click', () => {
    questions.forEach(([, result], index) => {
      const cell = answerCells[index];
      if (cell === undefined) return;
      // 最後の行だけは「b.length は 3 か」を聞いているので、数で答える。
      cell.textContent = index === questions.length - 1 ? String(b.length) : String(result);
    });
  });

  root.append(table, button);
}
