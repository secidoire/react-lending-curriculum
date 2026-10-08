import { beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { startListWithBugs } from './bad-examples/listWithBugs';
import { startManual } from './manual';
import { startRerender } from './rerender';

function mount(start: (root: HTMLElement) => void) {
  const root = document.createElement('div');
  document.body.replaceChildren(root);
  start(root);
}

// 行を、中に書かれた文字で探す（例：row('延長コード.*田中')）。
function row(pattern: string) {
  return page.getByRole('row', { name: new RegExp(pattern) });
}

async function addLoan(itemName: string, userName: string, status: '予約中' | '貸出中') {
  await page.getByLabelText('備品名').fill(itemName);
  await page.getByLabelText('借りる人').fill(userName);
  await page.getByLabelText('状態').selectOptions(status);
  await page.getByRole('button', { name: '追加' }).click();
}

// A版とB版は、書き方は違うが、同じ仕様を満たす。
describe.each([
  { name: 'A版（操作ごとにDOMを直す）', start: startManual },
  { name: 'B版（全部作り直す）', start: startRerender },
])('$name', ({ start }) => {
  beforeEach(() => mount(start));

  it('最初の3件を、備品・借りている人・状態つきで表示する', async () => {
    await expect.element(row('リーダブルコード.*佐藤.*貸出中')).toBeVisible();
    await expect.element(row('プロジェクター.*鈴木.*予約中')).toBeVisible();
    await expect.element(row('HDMIケーブル.*高橋.*返却済')).toBeVisible();
    await expect.element(page.getByText('全3件・貸出中1件')).toBeVisible();
  });

  it('追加した貸出が一覧の最後に出て、フォームは空に戻る', async () => {
    await addLoan('延長コード', '田中', '貸出中');

    await expect.element(page.getByRole('row').last().getByText('延長コード')).toBeVisible();
    await expect.element(page.getByLabelText('備品名')).toHaveValue('');
    await expect.element(page.getByText('全4件・貸出中2件')).toBeVisible();
  });

  it('削除ボタンを押した行だけが消え、件数も減る', async () => {
    await page.getByRole('button', { name: 'リーダブルコードを削除' }).click();

    await expect.element(row('リーダブルコード')).not.toBeInTheDocument();
    await expect.element(row('プロジェクター')).toBeVisible();
    await expect.element(page.getByText('全2件・貸出中0件')).toBeVisible();
  });

  it('「貸出中のみ表示」にすると貸出中だけになり、外すと全部に戻る。件数は変わらない', async () => {
    const lentOnly = page.getByLabelText('貸出中のみ表示');

    await lentOnly.click();
    await expect.element(row('リーダブルコード')).toBeVisible();
    await expect.element(row('プロジェクター')).not.toBeInTheDocument();
    await expect.element(page.getByText('全3件・貸出中1件')).toBeVisible();

    await lentOnly.click();
    await expect.element(row('プロジェクター')).toBeVisible();
  });

  it('絞り込み中に「予約中」で追加した貸出は出ない。外すと出る', async () => {
    const lentOnly = page.getByLabelText('貸出中のみ表示');
    await lentOnly.click();

    await addLoan('延長コード', '田中', '予約中');
    await expect.element(row('延長コード')).not.toBeInTheDocument();

    await lentOnly.click();
    await expect.element(row('延長コード')).toBeVisible();
  });
});

// ここから下は、解説ページの本文が言っていることを確かめる実験。仕様を守るテストではない。
describe('悪い例にある2つの直し忘れ', () => {
  beforeEach(() => mount(startListWithBugs));

  it('削除しても、件数の表示が変わらない', async () => {
    await page.getByRole('button', { name: 'リーダブルコードを削除' }).click();

    await expect.element(row('リーダブルコード')).not.toBeInTheDocument();
    await expect.element(page.getByText('全3件・貸出中1件')).toBeVisible();
  });

  it('絞り込み中に「予約中」で追加した行が、見えてしまう', async () => {
    await page.getByLabelText('貸出中のみ表示').click();
    await addLoan('延長コード', '田中', '予約中');

    await expect.element(row('延長コード')).toBeVisible();
  });
});

describe('2つの版の違い：ほかの行を削除したときのメモ欄', () => {
  async function typeMemoThenDeleteAnotherRow() {
    await page.getByLabelText('リーダブルコードのメモ').fill('来週返す');
    await page.getByRole('button', { name: 'プロジェクターを削除' }).click();
  }

  it('A版は、入力中のメモが残る', async () => {
    mount(startManual);
    await typeMemoThenDeleteAnotherRow();

    await expect.element(page.getByLabelText('リーダブルコードのメモ')).toHaveValue('来週返す');
  });

  // 次回（0-3）は、B版の単純さのまま、この違いをなくす方法を作る。
  it('B版は、入力中のメモが消える', async () => {
    mount(startRerender);
    await typeMemoThenDeleteAnotherRow();

    await expect.element(page.getByLabelText('リーダブルコードのメモ')).toHaveValue('');
  });
});
