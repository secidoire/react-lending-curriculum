// 教材用の悪い例：ボタンを押しても、画面が変わらない。
// どこが原因かは、解説ページの本文で考える（ここには答えを書かない）。
import { useState } from 'react';

export function PushLoans() {
  const [loans, setLoans] = useState(['リーダブルコード']);

  function addLoan() {
    loans.push(`備品${loans.length + 1}`);
    setLoans(loans);
  }

  return (
    <div>
      <p>
        <button type="button" onClick={addLoan}>
          1件追加
        </button>
      </p>
      <p className="loan-summary">全{loans.length}件</p>
      <ul>
        {loans.map((itemName) => (
          <li key={itemName}>{itemName}</li>
        ))}
      </ul>
    </div>
  );
}
