import { afterEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { startSandbox } from '../../sandbox/runSandbox';
import type { SandboxSpec } from '../../sandbox/types';
import { loanBoardSandbox, looseLoansSandbox } from './sandboxes';

// 解説ページの枠に渡しているのと同じ定義を、同じしくみで実行して確かめる。
let cleanup = () => {};
afterEach(() => cleanup());

type Edit = { file: string; from: string; to: string };

// edits は、本文で読者にしてもらう書き換えを、テストでも同じように行うためのもの。
function mount(spec: SandboxSpec, edits: Edit[] = [], onError?: (error: unknown) => void) {
  const root = document.createElement('div');
  document.body.replaceChildren(root);
  const files = spec.files.map((file) => {
    const code = edits.filter((edit) => edit.file === file.name).reduce((text, edit) => text.replace(edit.from, edit.to), file.code);
    return { ...file, code };
  });
  for (const edit of edits) expect(files.find((file) => file.name === edit.file)?.code).toContain(edit.to);
  cleanup = startSandbox(spec, files, root, { onError });
}

const row = (pattern: string) => page.getByRole('row', { name: new RegExp(pattern) });
const press = (name: string) => page.getByRole('button', { name }).click();

describe('LooseLoans（悪い例）：status と、あってもなくてもよい項目の組み合わせ', () => {
  it('延滞を確認してから返却すると、返却済なのに「延滞」が残り、返却日の記録もない', async () => {
    mount(looseLoansSandbox);

    await press('延滞を確認する');
    await expect.element(row('リーダブルコード.*貸出中.*延滞')).toBeVisible();

    await press('リーダブルコードを返却する');
    await expect.element(row('リーダブルコード.*返却済（返却日の記録なし）.*延滞')).toBeVisible();
  });

  it('予約中のものを、貸出にしないまま返却済にできてしまう', async () => {
    mount(looseLoansSandbox);

    await press('プロジェクターを返却する');

    await expect.element(row('プロジェクター.*返却済')).toBeVisible();
  });

  it('備品を改名しても、貸出の一覧は古い名前のまま', async () => {
    mount(looseLoansSandbox);

    await press('「プロジェクター」を改名する');

    await expect.element(page.getByText('備品：リーダブルコード、プロジェクター（新型）、HDMIケーブル')).toBeVisible();
    await expect.element(row('^プロジェクター 佐藤さん')).toBeVisible();
  });
});

describe('LoanBoard：状態ごとに型を分け、遷移を関数に集める', () => {
  it('最初から、期限を過ぎた貸出中のものにだけ「延滞」が出る（確認ボタンは要らない）', async () => {
    mount(loanBoardSandbox);

    await expect.element(row('リーダブルコード.*貸出中（期限 2026-10-17）.*延滞')).toBeVisible();
    await expect.element(row('HDMIケーブル.*貸出中（期限 2026-10-25）')).toBeVisible();
    await expect.element(page.getByText('延滞')).toHaveLength(1);
  });

  it('返却すると、返却日が入り、「延滞」は消える', async () => {
    mount(loanBoardSandbox);

    await press('リーダブルコードを返却する');

    await expect.element(row('リーダブルコード.*返却済（2026-10-20 に返却）')).toBeVisible();
    await expect.element(page.getByText('延滞')).not.toBeInTheDocument();
  });

  it('予約中のものには「返却する」がなく、貸出にすると期限が入って「返却する」に変わる', async () => {
    mount(loanBoardSandbox);
    await expect.element(page.getByRole('button', { name: 'プロジェクターを返却する' })).not.toBeInTheDocument();

    await press('プロジェクターを貸出にする');

    await expect.element(row('プロジェクター.*貸出中（期限 2026-10-22）')).toBeVisible();
    await expect.element(page.getByRole('button', { name: 'プロジェクターを返却する' })).toBeVisible();
  });

  it('備品を改名すると、貸出の一覧の名前も変わる', async () => {
    mount(loanBoardSandbox);

    await press('「プロジェクター」を改名する');

    await expect.element(row('プロジェクター（新型）.*佐藤さん')).toBeVisible();
  });

  it('画面を書き換えて、予約中のものに「返却する」を出しても、返却はできず、理由が出る', async () => {
    mount(loanBoardSandbox, [{ file: 'LoanRow.tsx', from: "{loan.status === 'lent' && (", to: '{true && (' }]);

    await press('プロジェクターを返却する');

    await expect.element(page.getByRole('alert')).toHaveTextContent('返却できるのは、貸出中のものだけです');
    await expect.element(row('プロジェクター.*予約中')).toBeVisible();
  });

  it('型にない状態（cancelled）のデータが紛れ込むと、describeLoan の default で止まる', async () => {
    const errors: string[] = [];
    mount(
      loanBoardSandbox,
      [{ file: 'initialLoans.ts', from: "status: 'reserved', reservedFrom", to: "status: 'cancelled', reservedFrom" }],
      (error) => errors.push(String(error)),
    );

    await expect.poll(() => errors.join()).toContain('想定していない状態です');
  });
});
