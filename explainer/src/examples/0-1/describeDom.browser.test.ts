import { expect, it } from 'vitest';
import { describeDom } from './describeDom';
import { loadPage, renameBorrower } from './page';

function createScreen(): HTMLElement {
  const screen = document.createElement('div');
  document.body.replaceChildren(screen);
  return screen;
}

it('ページを開くと、ファイルに書いていない <tbody> と </p> が入り、件数が書き換わっている', () => {
  const screen = createScreen();

  loadPage(screen);

  expect(describeDom(screen)).toBe(
    [
      '<p id="count">3件の貸出があります</p>',
      '<table>',
      '  <tbody>',
      '    <tr><th>備品</th><th>借りている人</th><th>状態</th></tr>',
      '    <tr><td>リーダブルコード</td><td>佐藤</td><td>貸出中</td></tr>',
      '    <tr><td>プロジェクター</td><td>鈴木</td><td>予約中</td></tr>',
      '    <tr><td>HDMIケーブル</td><td>高橋</td><td>返却済</td></tr>',
      '  </tbody>',
      '</table>',
      '<script src="main.js"></script>',
    ].join('\n'),
  );
});

it('DOMを書き換えても、もう一度開けば元に戻る', () => {
  const screen = createScreen();
  loadPage(screen);

  renameBorrower(screen);
  expect(describeDom(screen)).toContain('<td>佐藤（総務）</td>');

  loadPage(screen);
  expect(describeDom(screen)).not.toContain('佐藤（総務）');
});
