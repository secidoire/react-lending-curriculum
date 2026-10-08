import { useState } from 'react';

// Reactで書いた、いちばん小さな例。借りている本の数を数える。
export function Counter() {
  // count：いまの値。setCount：値を替えて、画面を描き直してもらうための関数。
  const [count, setCount] = useState(0);

  // この関数が返すJSXが、0-3の view() が返していた「画面のオブジェクト」にあたる。
  return (
    <p>
      借りている本：{count}冊{' '}
      <button type="button" onClick={() => setCount(count + 1)}>
        1冊借りる
      </button>
    </p>
  );
}
