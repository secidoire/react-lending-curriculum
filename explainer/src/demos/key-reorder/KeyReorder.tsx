import { useState } from 'react';
import { KeyColumn } from './KeyColumn';
import { initialItems, prepend, reverse, shuffle } from './logic';

// デモ(b)：同じ並べ替えを、keyの付け方が違う3つの一覧に同時に行う。本物のReactで動いている。
export function KeyReorder() {
  const [items, setItems] = useState(initialItems);
  const [nextNumber, setNextNumber] = useState(initialItems.length + 1);
  // 「リセット」のたびに増やす。一覧の key に使い、行のstateと入力欄ごと作り直す。
  const [resetCount, setResetCount] = useState(0);

  function addToTop() {
    setItems(prepend(items, nextNumber));
    setNextNumber(nextNumber + 1);
  }

  function reset() {
    setItems(initialItems);
    setNextNumber(initialItems.length + 1);
    setResetCount(resetCount + 1);
  }

  return (
    <figure className="box demo">
      <figcaption className="box-label">デモ：keyの付け方と、並べ替え</figcaption>
      <p>
        <button type="button" onClick={addToTop}>
          先頭に追加
        </button>{' '}
        <button type="button" onClick={() => setItems(reverse(items))}>
          逆順にする
        </button>{' '}
        <button type="button" onClick={() => setItems(shuffle(items, Math.random))}>
          シャッフル
        </button>{' '}
        <button type="button" onClick={reset}>
          リセット
        </button>
      </p>
      <div key={resetCount} className="key-columns">
        <KeyColumn title="key なし" mode="none" items={items} />
        <KeyColumn title="key に位置（index）" mode="index" items={items} />
        <KeyColumn title="key に id" mode="id" items={items} />
      </div>
      <p className="demo-note">備品名と、入力欄の「〜を借りる理由」が食い違った行に「ずれ」と出ます。</p>
    </figure>
  );
}
