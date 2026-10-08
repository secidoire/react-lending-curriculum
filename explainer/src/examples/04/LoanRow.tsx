import { describeLoan, isOverdue, type IsoDate, type Loan } from './loan';

type Props = {
  loan: Loan;
  itemName: string;
  today: IsoDate;
  onLend: () => void;
  onReturn: () => void;
};

export function LoanRow({ loan, itemName, today, onLend, onReturn }: Props) {
  return (
    <tr>
      <td>{itemName}</td>
      <td>{loan.userName}さん</td>
      <td>
        {describeLoan(loan)} {isOverdue(loan, today) && <strong className="overdue">延滞</strong>}
      </td>
      <td>
        {loan.status === 'reserved' && (
          <button type="button" aria-label={`${itemName}を貸出にする`} onClick={onLend}>
            貸出にする
          </button>
        )}
        {loan.status === 'lent' && (
          <button type="button" aria-label={`${itemName}を返却する`} onClick={onReturn}>
            返却する
          </button>
        )}
      </td>
    </tr>
  );
}
