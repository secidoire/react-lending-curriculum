import { afterEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { startSandbox } from '../../sandbox/runSandbox';
import type { SandboxSpec } from '../../sandbox/types';
import {
  compareUpdatesSandbox,
  counterSandbox,
  delayedCountSandbox,
  loopButtonsSandbox,
  objectIsSandbox,
  pushLoansSandbox,
} from './sandboxes';

// 解説ページの枠に渡しているのと同じ定義を、同じしくみで実行して確かめる。
let cleanup = () => {};
afterEach(() => cleanup());

// edit は、本文で読者にしてもらう書き換えを、テストでも同じように行うためのもの。
function mount(spec: SandboxSpec, edit: (code: string) => string = (code) => code) {
  const root = document.createElement('div');
  document.body.replaceChildren(root);
  const files = spec.files.map((file) => ({ ...file, code: edit(file.code) }));
  cleanup = startSandbox(spec, files, root);
}

it('Counter：ボタンを押すと、数が増える', async () => {
  mount(counterSandbox);

  await page.getByRole('button', { name: '1冊借りる' }).click();

  await expect.element(page.getByText(/借りている本：1冊/)).toBeVisible();
});

describe('PushLoans（悪い例）', () => {
  it('push してから同じ配列を set しても、画面は変わらない', async () => {
    mount(pushLoansSandbox);

    await page.getByRole('button', { name: '1件追加' }).click();
    await page.getByRole('button', { name: '1件追加' }).click();

    await expect.element(page.getByText('全1件')).toBeVisible();
  });

  it('新しい配列を作って set するように書き換えると、画面が変わる', async () => {
    mount(pushLoansSandbox, (code) => {
      const edited = code
        .replace('loans.push(`備品${loans.length + 1}`);\n', '')
        .replace('setLoans(loans);', 'setLoans([...loans, `備品${loans.length + 1}`]);');
      expect(edited).not.toBe(code);
      return edited;
    });

    await page.getByRole('button', { name: '1件追加' }).click();

    await expect.element(page.getByText('全2件')).toBeVisible();
    await expect.element(page.getByText('備品2')).toBeVisible();
  });
});

it('objectIs：答えを表示すると、本文の表どおりの結果が出る', async () => {
  mount(objectIsSandbox);

  await page.getByRole('button', { name: '答えを表示' }).click();

  const answers = [...document.querySelectorAll('tr')].map((row) => row.cells[1]?.textContent);
  expect(answers).toEqual(['true', 'true', 'true', 'false', 'false', 'false', 'true', '3']);
});

it('compareUpdates：配列と、変えた1件だけが新しく、ほかの行は同じもの', async () => {
  mount(compareUpdatesSandbox);

  await expect.element(page.getByRole('row', { name: /配列そのもの.*新しく作ったもの/ })).toBeVisible();
  await expect.element(page.getByRole('row', { name: /リーダブルコード.*同じもの/ })).toBeVisible();
  await expect.element(page.getByRole('row', { name: /プロジェクター.*returned.*新しく作ったもの/ })).toBeVisible();
  await expect.element(page.getByRole('row', { name: /HDMIケーブル.*同じもの/ })).toBeVisible();
});

it('DelayedCount：知らせるボタンを押したあとに追加しても、押した時点の件数が知らされる', async () => {
  // 3秒は待てないので、待ち時間だけ短くする。
  mount(delayedCountSandbox, (code) => code.replace('DELAY_MS = 3000', 'DELAY_MS = 300'));

  await page.getByRole('button', { name: '3秒後に件数を知らせる' }).click();
  await page.getByRole('button', { name: '1件追加' }).click();
  await page.getByRole('button', { name: '1件追加' }).click();

  await expect.element(page.getByText('全3件')).toBeVisible();
  await expect.element(page.getByText('お知らせ：いま借りているのは 1 件です')).toBeVisible();
});

it('loopButtons：var のボタンはどれを押しても 3 番、let のボタンは自分の番号になる', async () => {
  mount(loopButtonsSandbox);

  await page.getByRole('button', { name: 'var の 0 番' }).click();
  await expect.element(page.getByText('押されたのは 3 番です')).toBeVisible();

  await page.getByRole('button', { name: 'let の 1 番' }).click();
  await expect.element(page.getByText('押されたのは 1 番です')).toBeVisible();
});
