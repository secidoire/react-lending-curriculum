# ドメイン仕様

## エンティティ
- User { id, name, role: 'member' | 'admin' } / Item { id, name, category: 'book' | 'equipment' }
- Loan：状態ごとに必要なフィールドが変わる

## 状態遷移
reserved（予約中）→ lend → lent（貸出中）→ return → returned（返却済）。cancel は第7回の仕様変更で追加する。
- 延滞は状態ではない：`isOverdue(loan, now) = loan.status === 'lent' && now > loan.dueDate`
- 不正な遷移はドメイン関数がエラーとして返す。

## 型（第4回の到達点）
```ts
type LoanBase = { id: LoanId; itemId: ItemId; userId: UserId };
export type Loan =
  | (LoanBase & { status: 'reserved'; reservedFrom: IsoDate; reservedTo: IsoDate })
  | (LoanBase & { status: 'lent'; lentAt: IsoDateTime; dueDate: IsoDate })
  | (LoanBase & { status: 'returned'; lentAt: IsoDateTime; dueDate: IsoDate; returnedAt: IsoDateTime });
```
悪い例：`{ status: string; lentAt?: string; dueDate?: string; returnedAt?: string; overdue?: boolean }`
→「返却済なのに returnedAt がない」のような組み合わせを表現できてしまう。

## 正規化
- `itemsById` と `loansById` を正とし、備品名つきの一覧はセレクタ関数で導出する。Loanに備品名をコピーしない。

## ルール
- 日付の重複：同じ備品の期間が重なる予約は作れない。`overlaps` は半開区間 [from, to) で判定する。
- 権限：返却できるのは自分の貸出だけ、備品登録はadminだけ。正となるのは `policy.ts`（`canReturn`, `canRegisterItem`）で、UIでボタンを隠すのは表示上の配慮と位置づける。

## Repository
```ts
export interface LoanRepository {
  list(): Promise<Loan[]>;
  lend(itemId: ItemId, userId: UserId): Promise<Loan>;
  return(loanId: LoanId): Promise<Loan>;
}
```
- fake：setTimeoutで300〜800ms遅延させる。localStorageキーは `lending-app:v1:loans`。読み込み時にzodでparseし、失敗したら「データ破損」エラーにする。`?fail=0.3` を付けると30%の確率でrejectする。
- http：同じinterfaceを実装したfetchのスタブ。第7回で差し替えを実演する。
- 時刻は `Clock = () => Date` として注入する。