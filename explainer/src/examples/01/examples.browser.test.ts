import { afterEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { startSandbox } from '../../sandbox/runSandbox';
import type { SandboxSpec } from '../../sandbox/types';
import { allInOneSandbox, itemsPageSandbox, selectableListSandbox } from './sandboxes';

// 解説ページの枠に渡しているのと同じ定義を、同じしくみで実行して確かめる。
let cleanup = () => {};
afterEach(() => cleanup());

type Edit = { file: string; from: string; to: string };

// edits は、本文で読者にしてもらう書き換えを、テストでも同じように行うためのもの。
function mount(spec: SandboxSpec, edits: Edit[] = [], onLog?: (line: string) => void) {
  const root = document.createElement('div');
  document.body.replaceChildren(root);
  const files = spec.files.map((file) => {
    const code = edits.filter((edit) => edit.file === file.name).reduce((text, edit) => text.replaceAll(edit.from, edit.to), file.code);
    return { ...file, code };
  });
  cleanup = startSandbox(spec, files, root, { onLog });
}

const count = (text: string) => document.body.textContent.split(text).length - 1;

describe.each([
  ['1つに全部書いた版', allInOneSandbox],
  ['部品に分けた版', itemsPageSandbox],
])('%s', (_name, spec) => {
  it('件数・一覧・貸出中のものを表示する', async () => {
    mount(spec);

    await expect.element(page.getByText(/本 2件・\s*備品 3件/)).toBeVisible();
    await expect.element(page.getByRole('row', { name: /リーダブルコード.*本.*貸出中.*佐藤さん/ })).toBeVisible();
    await expect.element(page.getByRole('row', { name: /プロジェクター.*備品.*貸出できます/ })).toBeVisible();
    await expect.element(page.getByRole('listitem').filter({ hasText: /HDMIケーブル.*備品.*高橋さん/ })).toBeVisible();
  });
});

describe('「備品」を「機材」に呼び替える', () => {
  it('1つに全部書いた版：「備品」は3か所に書いてあり、1か所だけ直すと、残りは古いまま', async () => {
    expect(allInOneSandbox.files[0]?.code.split('備品').length).toBe(1 + 3);

    mount(allInOneSandbox, [{ file: 'AllInOne.tsx', from: 'badge-equipment">備品</span>\n                )}', to: 'badge-equipment">機材</span>\n                )}' }]);

    await expect.element(page.getByRole('row', { name: /プロジェクター.*機材/ })).toBeVisible();
    expect(count('備品')).toBeGreaterThan(0);
  });

  it('部品に分けた版：CategoryBadge.tsx の1か所を直すと、すべての場所が変わる', async () => {
    mount(itemsPageSandbox, [{ file: 'CategoryBadge.tsx', from: '>備品<', to: '>機材<' }]);

    await expect.element(page.getByRole('row', { name: /プロジェクター.*機材/ })).toBeVisible();
    expect(count('備品')).toBe(0);
    expect(count('機材')).toBe(1 + 3 + 1);
  });
});

describe('選べる一覧：レンダーとDOMの変更', () => {
  it('1行選ぶと、3行ともコンポーネントが呼ばれるが、入力中のメモは残る（DOMは作り直されない）', async () => {
    const lines: string[] = [];
    mount(selectableListSandbox, [], (line) => lines.push(line));
    await page.getByLabelText('プロジェクターのメモ').fill('来週使う');
    lines.length = 0;

    await page.getByRole('button', { name: '選ぶ' }).first().click();

    await expect.element(page.getByRole('row', { name: /リーダブルコード.*選択中/ })).toBeVisible();
    expect(lines).toEqual([
      'SelectableList を呼んだ。selectedId = item-1',
      'SelectableRow（リーダブルコード）を呼んだ。selected = true',
      'SelectableRow（プロジェクター）を呼んだ。selected = false',
      'SelectableRow（HDMIケーブル）を呼んだ。selected = false',
    ]);
    await expect.element(page.getByLabelText('プロジェクターのメモ')).toHaveValue('来週使う');
  });
});
