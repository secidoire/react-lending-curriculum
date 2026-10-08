// 教材用の悪い例。何が問題かは、解説ページの本文で考える（ここには答えを書かない）。
import { useState } from 'react';
import { initialItems } from '../items';
import { daysOfPeriod, formatDate } from '../period';

type Loan = { itemId: string; userName: string; from: string; to: string };

const emptyValues: Loan = { itemId: '', userName: '', from: '', to: '' };

export function LendFormNoCheck() {
  const [values, setValues] = useState(emptyValues);
  const [loans, setLoans] = useState<Loan[]>([]);

  function submit(event: { preventDefault: () => void }) {
    event.preventDefault();
    setLoans([...loans, values]);
    setValues(emptyValues);
  }

  return (
    <div>
      <form className="loan-form" onSubmit={submit}>
        <label htmlFor="itemId">備品</label>
        <select id="itemId" value={values.itemId} onChange={(event) => setValues({ ...values, itemId: event.target.value })}>
          <option value="">（選んでください）</option>
          {initialItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <label htmlFor="userName">借りる人</label>
        <input id="userName" value={values.userName} onChange={(event) => setValues({ ...values, userName: event.target.value })} />
        <label htmlFor="from">いつから</label>
        <input id="from" type="date" value={values.from} onChange={(event) => setValues({ ...values, from: event.target.value })} />
        <label htmlFor="to">いつまで</label>
        <input id="to" type="date" value={values.to} onChange={(event) => setValues({ ...values, to: event.target.value })} />
        <button type="submit">貸出を登録</button>
      </form>
      <ul>
        {loans.map((loan, index) => (
          // 登録した順に後ろへ足すだけで、並べ替えも削除もしないので、位置をkeyにする。
          <li key={index}>
            {initialItems.find((item) => item.id === loan.itemId)?.name ?? '（備品なし）'}：{loan.userName}さん、
            {formatDate(loan.from)} 〜 {formatDate(loan.to)}（{daysOfPeriod(loan.from, loan.to)}日間）
          </li>
        ))}
      </ul>
    </div>
  );
}
