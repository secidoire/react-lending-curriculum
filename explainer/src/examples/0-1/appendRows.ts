export type Item = { name: string; borrower: string; status: string };

const STATUSES = ['予約中', '貸出中', '返却済'];

export function makeItems(count: number): Item[] {
  return Array.from({ length: count }, (_, index) => ({
    name: `備品${index + 1}`,
    borrower: `社員${(index % 20) + 1}`,
    status: STATUSES[index % STATUSES.length] ?? '',
  }));
}

function createRow(item: Item): HTMLTableRowElement {
  const row = document.createElement('tr');
  for (const text of [item.name, item.borrower, item.status]) {
    const cell = document.createElement('td');
    cell.textContent = text;
    row.append(cell);
  }
  return row;
}

// 方法1：1行ずつ、表に追加する。
export function appendOneByOne(tbody: HTMLElement, items: readonly Item[]): void {
  for (const item of items) {
    tbody.append(createRow(item));
  }
}

// 方法2：行をすべて作ってから、1回の操作で表に追加する。
export function appendWithFragment(tbody: HTMLElement, items: readonly Item[]): void {
  // DocumentFragment はまだ画面につながっていない入れ物。ここに足している間、画面のDOMは変わらない。
  const fragment = document.createDocumentFragment();
  for (const item of items) {
    fragment.append(createRow(item));
  }
  tbody.append(fragment);
}

// 方法3：1行ずつ追加し、追加するたびに表の高さを読む。
export function appendWithLayoutRead(tbody: HTMLElement, items: readonly Item[]): void {
  for (const item of items) {
    tbody.append(createRow(item));
    // 高さは最新のレイアウトがないと答えられない値なので、読むたびにブラウザはレイアウトを計算し直す。
    void tbody.offsetHeight;
  }
}

// fn を実行し、かかった時間（ミリ秒）を返す。
export function measure(fn: () => void): number {
  const start = performance.now();
  fn();
  // ブラウザはレイアウトの計算を後回しにする。どの方法でも計算が終わるところまで測るために、最後に1回高さを読む。
  void document.body.offsetHeight;
  return performance.now() - start;
}
