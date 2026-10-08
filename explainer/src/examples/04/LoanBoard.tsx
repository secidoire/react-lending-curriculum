import { useReducer, useState } from 'react';
import { initialItems, initialLoans } from './initialLoans';
import { LoanRow } from './LoanRow';
import { loansReducer } from './loansReducer';

// 「今日」を決まった日にして動かす。ふだんのアプリでは、ここに現在の日付が入る。
const TODAY = '2026-10-20';

export function LoanBoard() {
  const [state, dispatch] = useReducer(loansReducer, { loans: initialLoans, error: null });
  const [items, setItems] = useState(initialItems);

  function renameProjector() {
    setItems(items.map((item) => (item.id === 'item-2' ? { ...item, name: 'プロジェクター（新型）' } : item)));
  }

  return (
    <div>
      <p>
        今日：{TODAY}{' '}
        <button type="button" onClick={renameProjector}>
          「プロジェクター」を改名する
        </button>
      </p>
      {state.error !== null && (
        <p className="field-error" role="alert">
          {state.error}
        </p>
      )}
      <table>
        <tbody>
          {state.loans.map((loan) => (
            <LoanRow
              key={loan.id}
              loan={loan}
              // 貸出は、備品の名前を持たない。備品の id から、いまの名前を引く。
              itemName={items.find((item) => item.id === loan.itemId)?.name ?? '（不明な備品）'}
              today={TODAY}
              onLend={() => dispatch({ type: 'lent', loanId: loan.id, today: TODAY })}
              onReturn={() => dispatch({ type: 'returned', loanId: loan.id, today: TODAY })}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
