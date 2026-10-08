import { initialLoans, STATUS_LABELS } from './data.js';

// ページを開いたときに1回だけ呼ばれる。お題のコードは、この関数の中に書く。
export function startApp() {
  // 貸出のデータ。追加・削除で中身が変わる。
  let loans = [...initialLoans];

  // TODO: ここから書く（下の console.log は消してかまいません）
  console.log('まだ何も表示していません', loans, STATUS_LABELS);
}
