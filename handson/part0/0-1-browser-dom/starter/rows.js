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
  // TODO: ここを書く
}

// items の行をすべて作ってから、1回の操作で tbody の末尾に追加する。
export function appendWithFragment(tbody, items) {
  // TODO: ここを書く
}

// items を1件ずつ tbody の末尾に追加し、追加するたびに tbody.offsetHeight を読む。
export function appendWithLayoutRead(tbody, items) {
  // TODO: ここを書く
}
