// フォームの送信でページが移動すると、テストが続けられなくなる。
// 送信の処理がまだ書かれていないときでも移動しないよう、テストの間だけ止めておく。
// （アプリ側の submit の処理が先に動き、そのあとでここに届く）
document.addEventListener('submit', (event) => event.preventDefault());

// index.html の <body> の中身を、テスト用のページに入れる。<script> は動かさない（テストが startApp を呼ぶ）。
export function mountPage(html: string): void {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  for (const script of parsed.querySelectorAll('script')) script.remove();
  document.body.replaceChildren(...parsed.body.childNodes);
}
