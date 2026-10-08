import { find } from '../find';

// 例の中で「index.html に書いてある内容」として扱う文字列。この文字列は、何をしても変わらない。
export const SOURCE_HTML = `<p id="count">（件数を数えています）
<table>
  <tr><th>備品</th><th>借りている人</th><th>状態</th></tr>
  <tr><td>リーダブルコード</td><td>佐藤</td><td>貸出中</td></tr>
  <tr><td>プロジェクター</td><td>鈴木</td><td>予約中</td></tr>
  <tr><td>HDMIケーブル</td><td>高橋</td><td>返却済</td></tr>
</table>
<script src="main.js"></script>`;

// ページを開く（リロードする）ときにブラウザがしていることを、小さく再現する。
export function loadPage(screen: HTMLElement): void {
  // 1. HTMLの文字列をパースして、DOMを作る。
  //    先頭の <!doctype html> は、ふつうのHTMLファイルの1行目にある宣言。これがあると標準の決まりでパースされる。
  const parsed = new DOMParser().parseFromString(`<!doctype html>${SOURCE_HTML}`, 'text/html');
  screen.replaceChildren(...parsed.body.childNodes);

  // 2. ページのJavaScript（main.js にあたる処理）が、できあがったDOMを書き換える。
  const dataRowCount = screen.querySelectorAll('td:first-child').length;
  find(screen, '#count', HTMLParagraphElement).textContent = `${dataRowCount}件の貸出があります`;
}

// 検証ツールの Elements パネルで文字を直すのと同じことをする。
export function renameBorrower(screen: HTMLElement): void {
  for (const cell of screen.querySelectorAll('td')) {
    if (cell.textContent === '佐藤') cell.textContent = '佐藤（総務）';
  }
}
