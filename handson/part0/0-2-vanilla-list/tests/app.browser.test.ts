import { beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import * as manual from '../solution/a-manual/app.js';
import manualHtml from '../solution/a-manual/index.html?raw';
import * as rerender from '../solution/b-render/app.js';
import rerenderHtml from '../solution/b-render/index.html?raw';
import * as starter from '../starter/app.js';
import starterHtml from '../starter/index.html?raw';
import { mountPage } from './mountPage';

// ふだんは solution の2つの版を、`npm run test:starter` のときは starter（自分のコード）を確かめる。
const targets =
  import.meta.env.MODE === 'starter'
    ? [{ name: 'starter', html: starterHtml, startApp: starter.startApp }]
    : [
        { name: 'solution/a-manual', html: manualHtml, startApp: manual.startApp },
        { name: 'solution/b-render', html: rerenderHtml, startApp: rerender.startApp },
      ];

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

describe.each(targets)('$name', ({ html, startApp }) => {
  beforeEach(() => {
    mountPage(html);
    startApp();
  });

  describe('1. 一覧', () => {
    it('最初の3件を、備品・借りている人・状態つきで表示する', async () => {
      await expect.element(row('リーダブルコード.*佐藤.*貸出中')).toBeVisible();
      await expect.element(row('プロジェクター.*鈴木.*予約中')).toBeVisible();
      await expect.element(row('HDMIケーブル.*高橋.*返却済')).toBeVisible();
    });

    it('行ごとにメモ欄と削除ボタンがある', async () => {
      await expect.element(page.getByLabelText('リーダブルコードのメモ')).toBeVisible();
      await expect.element(page.getByRole('button', { name: 'リーダブルコードを削除' })).toBeVisible();
    });
  });

  describe('2. 追加', () => {
    it('フォームから追加した貸出が、一覧の最後に出る', async () => {
      await addLoan('延長コード', '田中', '貸出中');

      await expect.element(row('延長コード.*田中.*貸出中')).toBeVisible();
      await expect.element(page.getByRole('row').last().getByText('延長コード')).toBeVisible();
    });

    it('追加したら、フォームは空に戻る', async () => {
      await addLoan('延長コード', '田中', '貸出中');

      await expect.element(page.getByLabelText('備品名')).toHaveValue('');
    });
  });

  describe('3. 削除', () => {
    it('削除ボタンを押した行だけが消える', async () => {
      await page.getByRole('button', { name: 'プロジェクターを削除' }).click();

      await expect.element(row('プロジェクター')).not.toBeInTheDocument();
      await expect.element(row('リーダブルコード')).toBeVisible();
      await expect.element(row('HDMIケーブル')).toBeVisible();
    });
  });

  describe('4. 「貸出中のみ表示」', () => {
    it('チェックすると貸出中だけになり、外すと全部に戻る', async () => {
      const lentOnly = page.getByLabelText('貸出中のみ表示');

      await lentOnly.click();
      await expect.element(row('リーダブルコード')).toBeVisible();
      await expect.element(row('プロジェクター')).not.toBeInTheDocument();
      await expect.element(row('HDMIケーブル')).not.toBeInTheDocument();

      await lentOnly.click();
      await expect.element(row('プロジェクター')).toBeVisible();
      await expect.element(row('HDMIケーブル')).toBeVisible();
    });

    it('チェック中に「予約中」で追加した貸出は出ない。外すと出る', async () => {
      const lentOnly = page.getByLabelText('貸出中のみ表示');
      await lentOnly.click();

      await addLoan('延長コード', '田中', '予約中');
      await expect.element(row('延長コード')).not.toBeInTheDocument();

      await lentOnly.click();
      await expect.element(row('延長コード')).toBeVisible();
    });

    it('チェック中に「貸出中」で追加した貸出は出る', async () => {
      await page.getByLabelText('貸出中のみ表示').click();

      await addLoan('延長コード', '田中', '貸出中');

      await expect.element(row('延長コード')).toBeVisible();
    });
  });

  describe('5. 仕様追加：件数の表示', () => {
    it('最初は「全3件・貸出中1件」', async () => {
      await expect.element(page.getByText('全3件・貸出中1件')).toBeVisible();
    });

    it('追加すると増える', async () => {
      await addLoan('延長コード', '田中', '貸出中');
      await expect.element(page.getByText('全4件・貸出中2件')).toBeVisible();

      await addLoan('三脚', '伊藤', '予約中');
      await expect.element(page.getByText('全5件・貸出中2件')).toBeVisible();
    });

    it('削除すると減る', async () => {
      await page.getByRole('button', { name: 'リーダブルコードを削除' }).click();

      await expect.element(page.getByText('全2件・貸出中0件')).toBeVisible();
    });

    it('「貸出中のみ表示」にしても、件数は変わらない', async () => {
      await page.getByLabelText('貸出中のみ表示').click();

      await expect.element(page.getByText('全3件・貸出中1件')).toBeVisible();
    });

    it('チェック中に追加・削除しても、件数は全体を数える', async () => {
      await page.getByLabelText('貸出中のみ表示').click();
      await addLoan('三脚', '伊藤', '予約中');
      await page.getByRole('button', { name: 'リーダブルコードを削除' }).click();

      await expect.element(page.getByText('全3件・貸出中0件')).toBeVisible();
    });
  });
});

// ここから下は、2つの版の違いを確かめる実験。仕様を守るテストではない。
// 次回（0-3）は、B版の単純さのまま、この違いをなくす方法を作る。
describe.runIf(import.meta.env.MODE !== 'starter')('2つの版の違い：ほかの行を削除したときのメモ欄', () => {
  async function typeMemoThenDeleteAnotherRow() {
    await page.getByLabelText('リーダブルコードのメモ').fill('来週返す');
    await page.getByRole('button', { name: 'プロジェクターを削除' }).click();
  }

  it('A版（差分を手で書く）は、入力中のメモが残る', async () => {
    mountPage(manualHtml);
    manual.startApp();

    await typeMemoThenDeleteAnotherRow();

    await expect.element(page.getByLabelText('リーダブルコードのメモ')).toHaveValue('来週返す');
  });

  it('B版（全部作り直す）は、入力中のメモが消える', async () => {
    mountPage(rerenderHtml);
    rerender.startApp();

    await typeMemoThenDeleteAnotherRow();

    await expect.element(page.getByLabelText('リーダブルコードのメモ')).toHaveValue('');
  });
});
