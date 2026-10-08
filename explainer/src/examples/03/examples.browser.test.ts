import { afterEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { startSandbox } from '../../sandbox/runSandbox';
import type { SandboxSpec } from '../../sandbox/types';
import { lendFormNoCheckSandbox, lendPageSandbox } from './sandboxes';

// 解説ページの枠に渡しているのと同じ定義を、同じしくみで実行して確かめる。
let cleanup = () => {};
afterEach(() => cleanup());

type Edit = { file: string; from: string; to: string };

// edits は、本文で読者にしてもらう書き換えを、テストでも同じように行うためのもの。
function mount(spec: SandboxSpec, edits: Edit[] = []) {
  const root = document.createElement('div');
  document.body.replaceChildren(root);
  const files = spec.files.map((file) => {
    const code = edits.filter((edit) => edit.file === file.name).reduce((text, edit) => text.replace(edit.from, edit.to), file.code);
    return { ...file, code };
  });
  for (const edit of edits) expect(files.find((file) => file.name === edit.file)?.code).toContain(edit.to);
  cleanup = startSandbox(spec, files, root);
}

async function fill(values: { item?: string; user?: string; from?: string; to?: string }) {
  if (values.item !== undefined) await page.getByLabelText('備品').selectOptions(values.item);
  if (values.user !== undefined) await page.getByLabelText('借りる人').fill(values.user);
  if (values.from !== undefined) await page.getByLabelText('いつから').fill(values.from);
  if (values.to !== undefined) await page.getByLabelText('いつまで').fill(values.to);
}

const submit = () => page.getByRole('button', { name: '貸出を登録' }).click();

describe('LendFormNoCheck（悪い例）：確かめずに登録する', () => {
  it('何も入力せずに登録すると、Invalid Date と NaN が一覧に出る', async () => {
    mount(lendFormNoCheckSandbox);

    await submit();

    await expect.element(page.getByText(/Invalid Date 〜 Invalid Date（NaN日間）/)).toBeVisible();
  });

  it('「いつまで」が「いつから」より前でも、登録できてしまう', async () => {
    mount(lendFormNoCheckSandbox);

    await fill({ item: 'プロジェクター', user: '佐藤', from: '2026-10-12', to: '2026-10-10' });
    await submit();

    await expect.element(page.getByText(/2026\/10\/12 〜 2026\/10\/10（-1日間）/)).toBeVisible();
  });
});

describe('LendPage：境界で確かめてから登録する', () => {
  it('正しい入力は登録され、フォームは空に戻る', async () => {
    mount(lendPageSandbox);

    await fill({ item: 'プロジェクター', user: '佐藤', from: '2026-10-12', to: '2026-10-14' });
    await submit();

    await expect.element(page.getByText('プロジェクター：佐藤さん、2026/10/12 〜 2026/10/14（3日間）')).toBeVisible();
    await expect.element(page.getByLabelText('借りる人')).toHaveValue('');
  });

  it('何も入力せずに登録すると、欄ごとに理由が出て、最初の欄にフォーカスが移る。一覧には何も足されない', async () => {
    mount(lendPageSandbox);

    await submit();

    await expect.element(page.getByText('備品を選んでください')).toBeVisible();
    await expect.element(page.getByText('「いつまで」の日付を入力してください')).toBeVisible();
    await expect.element(page.getByLabelText('備品')).toHaveFocus();
    await expect.element(page.getByText('まだ貸出はありません。')).toBeVisible();
  });

  it('「いつまで」が前の日付なら、その欄に理由が出て、フォーカスが移る。直すと登録できる', async () => {
    mount(lendPageSandbox);
    await fill({ item: 'プロジェクター', user: '佐藤', from: '2026-10-12', to: '2026-10-10' });

    await submit();
    await expect.element(page.getByText(/「いつまで」は、「いつから」と同じ日か/)).toBeVisible();
    await expect.element(page.getByLabelText('いつまで')).toHaveFocus();

    await fill({ to: '2026-10-12' });
    await submit();
    await expect.element(page.getByText(/2026\/10\/12 〜 2026\/10\/12（1日間）/)).toBeVisible();
    await expect.element(page.getByText(/「いつまで」は、「いつから」と同じ日か/)).not.toBeInTheDocument();
  });

  it('スキーマに「最長14日」の確認を足すと、15日間の貸出は登録できなくなる', async () => {
    mount(lendPageSandbox, [
      {
        file: 'lendFormSchema.ts',
        from: "import { z } from 'zod';",
        to: "import { z } from 'zod';\nimport { daysOfPeriod } from './period';",
      },
      {
        file: 'lendFormSchema.ts',
        from: "\n\n// 確かめ終わった値の型。",
        to: "\n  .refine((value) => daysOfPeriod(value.from, value.to) <= 14, { path: ['to'], message: '借りられるのは14日間までです' });\n\n// 確かめ終わった値の型。",
      },
      { file: 'lendFormSchema.ts', from: "それより後にしてください',\n  });", to: "それより後にしてください',\n  })" },
    ]);
    await fill({ item: 'プロジェクター', user: '佐藤', from: '2026-10-01', to: '2026-10-15' });

    await submit();

    await expect.element(page.getByText('借りられるのは14日間までです')).toBeVisible();
    await expect.element(page.getByText('まだ貸出はありません。')).toBeVisible();
  });
});
