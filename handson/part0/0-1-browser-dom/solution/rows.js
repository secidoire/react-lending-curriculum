// 1件ぶんの <tr> を作って返す（完成済み）。
export function createRow(item) {
  const tr = document.createElement('tr');
  for (const text of [item.name, item.borrower, item.status]) {
    const td = document.createElement('td');
    td.textContent = text;
    tr.append(td);
  }
  return tr;
}

// items を1件ずつ、tbody の末尾に追加する。
export function appendOneByOne(tbody, items) {
  for (const item of items) {
    tbody.append(createRow(item));
  }
}

// items の行をすべて作ってから、1回の操作で tbody の末尾に追加する。
export function appendWithFragment(tbody, items) {
  // DocumentFragment はまだ画面につながっていない入れ物。ここに足している間、DOMは変わらない。
  const fragment = document.createDocumentFragment();
  for (const item of items) {
    fragment.append(createRow(item));
  }
  tbody.append(fragment);
}

// items を1件ずつ tbody の末尾に追加し、追加するたびに tbody.offsetHeight を読む。
export function appendWithLayoutRead(tbody, items) {
  for (const item of items) {
    tbody.append(createRow(item));
    // 高さは最新のレイアウトがないと答えられない値なので、読むたびにブラウザはレイアウトを計算し直す。
    void tbody.offsetHeight;
  }
}
