import { beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { startSandbox } from '../../sandbox/runSandbox';
import type { SandboxSpec } from '../../sandbox/types';
import { diffByIndexSandbox, firstTreeSandbox, fullRedrawSandbox, jsxSandbox, keyedSandbox } from './sandboxes';

// 解説ページの枠に渡しているのと同じ定義を、同じしくみで実行して確かめる。
function mount(spec: SandboxSpec, files = spec.files) {
  const root = document.createElement('div');
  document.body.replaceChildren(root);
  startSandbox(spec, files, root);
}

const memoOf = (itemName: string) => page.getByLabelText(`${itemName}のメモ`);

it('最初の例：h() で書いた画面が出て、その下にオブジェクトの中身が出る', async () => {
  mount(firstTreeSandbox);

  await expect.element(page.getByText('リーダブルコード', { exact: true })).toBeVisible();
  await expect.element(page.getByText(/"type": "strong"/)).toBeVisible();
});

describe.each([
  ['その1（全部作り直す）', fullRedrawSandbox],
  ['その2（差分・位置で対応）', diffByIndexSandbox],
  ['完成版（key対応）', keyedSandbox],
  ['JSX版', jsxSandbox],
])('%s：どの段階でも、一覧としては同じように動く', (_name, spec) => {
  beforeEach(() => mount(spec));

  it('状態を切り替えると、その行の表示と件数が変わる', async () => {
    await expect.element(page.getByText('全3件・貸出中2件')).toBeVisible();

    await page.getByRole('button', { name: 'リーダブルコードの状態を切り替える' }).click();

    await expect.element(page.getByRole('row', { name: /リーダブルコード.*返却済/ })).toBeVisible();
    await expect.element(page.getByText('全3件・貸出中1件')).toBeVisible();
  });

  it('先頭に追加すると、新しい行がいちばん上に入る', async () => {
    await page.getByRole('button', { name: '先頭に1件追加' }).click();

    await expect.element(page.getByRole('row').first().getByText('新しい備品4')).toBeVisible();
    await expect.element(page.getByText('全4件・貸出中3件')).toBeVisible();
  });
});

// ここから下は、段階ごとの違いを確かめる実験。解説ページの本文が言っていることと対応している。
describe('入力中のメモは、ほかの行の状態を切り替えたあとどうなるか', () => {
  async function typeMemoThenToggleAnotherRow() {
    await memoOf('リーダブルコード').fill('来週返す');
    await page.getByRole('button', { name: 'プロジェクターの状態を切り替える' }).click();
  }

  it('その1（全部作り直す）：消える', async () => {
    mount(fullRedrawSandbox);
    await typeMemoThenToggleAnotherRow();

    await expect.element(memoOf('リーダブルコード')).toHaveValue('');
  });

  it('その2（差分）：残る', async () => {
    mount(diffByIndexSandbox);
    await typeMemoThenToggleAnotherRow();

    await expect.element(memoOf('リーダブルコード')).toHaveValue('来週返す');
  });
});

describe('入力中のメモは、先頭に1件追加したあとどうなるか', () => {
  async function typeMemoThenAddToTop() {
    await memoOf('リーダブルコード').fill('来週返す');
    await page.getByRole('button', { name: '先頭に1件追加' }).click();
  }

  it('その2（位置で対応づける）：メモが、新しく入った行にずれる', async () => {
    mount(diffByIndexSandbox);
    await typeMemoThenAddToTop();

    await expect.element(memoOf('新しい備品4')).toHaveValue('来週返す');
    await expect.element(memoOf('リーダブルコード')).toHaveValue('');
  });

  it('完成版でも、app.ts に key を書いていなければ、同じようにずれる', async () => {
    mount(keyedSandbox);
    await typeMemoThenAddToTop();

    await expect.element(memoOf('新しい備品4')).toHaveValue('来週返す');
  });

  it('完成版で、行に key を書くと、メモは元の行に残る', async () => {
    // 本文で読者に足してもらう変更（'tr' の props に key を書く）を、ここでも同じように足す。
    const files = keyedSandbox.files.map((file) =>
      file.name === 'app.ts' ? { ...file, code: file.code.replace("'tr',\n              null,", "'tr',\n              { key: loan.id },") } : file,
    );
    expect(files).not.toEqual(keyedSandbox.files);

    mount(keyedSandbox, files);
    await typeMemoThenAddToTop();

    await expect.element(memoOf('リーダブルコード')).toHaveValue('来週返す');
    await expect.element(memoOf('新しい備品4')).toHaveValue('');
  });

  it('JSX版（key を書いてある）：メモは元の行に残る', async () => {
    mount(jsxSandbox);
    await typeMemoThenAddToTop();

    await expect.element(memoOf('リーダブルコード')).toHaveValue('来週返す');
  });
});
