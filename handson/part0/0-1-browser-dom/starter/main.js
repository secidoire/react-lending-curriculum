import { makeItems } from './items.js';
import { measure } from './measure.js';
import { appendOneByOne, appendWithFragment, appendWithLayoutRead } from './rows.js';

// このファイルは完成済みです。お題で書くのは rows.js だけです。

// --- 件数表示 ---
const loanRows = document.querySelectorAll('#loan-table .loan');
document.querySelector('#count').textContent = `${loanRows.length}件の貸出があります`;

// --- 実験A：色と幅 ---
document.querySelector('#change-color').addEventListener('click', () => {
  loanRows[0].classList.toggle('colored');
});

document.querySelector('#change-width').addEventListener('click', () => {
  document.querySelector('#loan-table th').classList.toggle('wide');
});

// --- 実験B：1000行を追加する ---
const items = makeItems(1000);
const tbody = document.querySelector('#big-table tbody');
const result = document.querySelector('#result');

function run(label, append) {
  tbody.replaceChildren();
  const ms = measure(() => append(tbody, items));
  result.textContent = `${label}：${ms.toFixed(1)} ms（${tbody.children.length}行）`;
}

document.querySelector('#add-one-by-one').addEventListener('click', () => {
  run('1行ずつ追加', appendOneByOne);
});

document.querySelector('#add-with-fragment').addEventListener('click', () => {
  run('まとめて追加', appendWithFragment);
});

document.querySelector('#add-with-layout-read').addEventListener('click', () => {
  run('1行ずつ追加し、毎回高さを読む', appendWithLayoutRead);
});

document.querySelector('#clear').addEventListener('click', () => {
  tbody.replaceChildren();
  result.textContent = 'クリアしました。';
});
