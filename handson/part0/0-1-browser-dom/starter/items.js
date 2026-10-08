const STATUSES = ['予約中', '貸出中', '返却済'];

// 実験B用のデータを count 件作る。
export function makeItems(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: `item-${index + 1}`,
    name: `備品${index + 1}`,
    borrower: `社員${(index % 20) + 1}`,
    status: STATUSES[index % STATUSES.length],
  }));
}
