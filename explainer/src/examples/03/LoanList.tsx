import type { Item } from './items';
import type { LendRequest } from './lendFormSchema';
import { daysOfPeriod, formatDate } from './period';

type Props = {
  loans: readonly LendRequest[];
  items: readonly Item[];
};

// 登録された貸出の一覧。受け取るのは、確かめ終わった LendRequest だけ。
export function LoanList({ loans, items }: Props) {
  if (loans.length === 0) return <p>まだ貸出はありません。</p>;

  return (
    <ul>
      {loans.map((loan, index) => (
        // 登録した順に後ろへ足すだけで、並べ替えも削除もしないので、位置をkeyにする。
        <li key={index}>
          {items.find((item) => item.id === loan.itemId)?.name}：{loan.userName}さん、
          {formatDate(loan.from)} 〜 {formatDate(loan.to)}（{daysOfPeriod(loan.from, loan.to)}日間）
        </li>
      ))}
    </ul>
  );
}
