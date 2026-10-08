// fn を実行し、かかった時間（ミリ秒）を返す。
export function measure(fn) {
  const start = performance.now();
  fn();
  // どの方法でも同じところまで測るために、最後に1回、ページの高さを読んでおく。
  // なぜこれが要るのかは、実験Bを終えてから考えてみよう。
  void document.body.offsetHeight;
  return performance.now() - start;
}
