import { useState } from 'react';

const DELAY_MS = 3000;

// ボタンを押した3秒後に、借りている件数を知らせる。
export function DelayedCount() {
  const [count, setCount] = useState(1);
  const [message, setMessage] = useState('（まだ知らせていません）');

  function notifyLater() {
    setTimeout(() => {
      setMessage(`いま借りているのは ${count} 件です`);
    }, DELAY_MS);
  }

  return (
    <div>
      <p className="loan-summary">全{count}件</p>
      <p>
        <button type="button" onClick={() => setCount(count + 1)}>
          1件追加
        </button>{' '}
        <button type="button" onClick={notifyLater}>
          3秒後に件数を知らせる
        </button>
      </p>
      <p>お知らせ：{message}</p>
    </div>
  );
}
