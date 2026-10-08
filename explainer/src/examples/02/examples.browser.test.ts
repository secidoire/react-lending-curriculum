import { afterEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { startSandbox } from '../../sandbox/runSandbox';
import type { SandboxSpec } from '../../sandbox/types';
import { derivedStateSandbox, itemsPageSandbox, searchFieldSandbox, syncWithEffectSandbox } from './sandboxes';

// 解説ページの枠に渡しているのと同じ定義を、同じしくみで実行して確かめる。
let cleanup = () => {};
afterEach(() => cleanup());

// edit は、本文で読者にしてもらう書き換えを、テストでも同じように行うためのもの。
function mount(spec: SandboxSpec, edit: (code: string) => string = (code) => code, onLog?: (line: string) => void) {
  const root = document.createElement('div');
  document.body.replaceChildren(root);
  const files = spec.files.map((file) => ({ ...file, code: edit(file.code) }));
  cleanup = startSandbox(spec, files, root, { onLog });
}

const search = () => page.getByLabelText('名前で検索');

describe('SearchField：入力欄の中身を state が決める', () => {
  it('入力すると、state と入力欄の両方が変わる', async () => {
    mount(searchFieldSandbox);

    await search().fill('コード');

    await expect.element(page.getByText('stateの中身：「コード」（3文字）')).toBeVisible();
  });

  it('onChange を取り除くと、入力しても中身が変わらない', async () => {
    mount(searchFieldSandbox, (code) => {
      const edited = code.replace(' onChange={(event) => setQuery(event.target.value)}', '');
      expect(edited).not.toBe(code);
      return edited;
    });

    await search().click();
    await page.getByLabelText('名前で検索').query()?.dispatchEvent(new InputEvent('input', { bubbles: true, data: 'あ' }));

    await expect.element(search()).toHaveValue('');
  });
});

describe('DerivedState（悪い例）：一覧と件数を別々の state に持つ', () => {
  it('名前で検索したときは、件数も合う', async () => {
    mount(derivedStateSandbox);

    await search().fill('コード');

    await expect.element(page.getByText('5件中 2件を表示')).toBeVisible();
    await expect.element(page.getByRole('listitem')).toHaveLength(2);
  });

  it('「本だけ」にすると、一覧は2件になるのに、件数は5件のまま', async () => {
    mount(derivedStateSandbox);

    await page.getByLabelText('本だけ').click();

    await expect.element(page.getByRole('listitem')).toHaveLength(2);
    await expect.element(page.getByText('5件中 5件を表示')).toBeVisible();
  });
});

describe('SyncWithEffect（悪い例）：一覧の state をエフェクトで合わせる', () => {
  it('表示は最後には合うが、1回の操作で2回レンダーされ、1回目は古い件数のまま', async () => {
    const lines: string[] = [];
    mount(syncWithEffectSandbox, undefined, (line) => lines.push(line));
    // 最初の表示でも、エフェクトが一覧を set し直すので、2回レンダーされる。それが済むのを待つ。
    await expect.poll(() => lines.length).toBe(2);
    lines.length = 0;

    await page.getByLabelText('本だけ').click();

    await expect.element(page.getByText('5件中 2件を表示')).toBeVisible();
    expect(lines).toEqual([
      'レンダーした。本だけ = true、表示する件数 = 5',
      'レンダーした。本だけ = true、表示する件数 = 2',
    ]);
  });
});

describe('ItemsPage：条件だけを state にして、一覧は計算する', () => {
  it('名前・種類・並び順を組み合わせても、一覧と件数が合う', async () => {
    mount(itemsPageSandbox);

    await search().fill('コード');
    await expect.element(page.getByText('5件中 2件を表示')).toBeVisible();

    await page.getByLabelText('本だけ').click();
    await expect.element(page.getByText('5件中 1件を表示')).toBeVisible();
    await expect.element(page.getByRole('listitem')).toHaveLength(1);

    await search().fill('');
    await page.getByLabelText('本だけ').click();
    await page.getByLabelText('名前順に並べる').click();
    await expect.element(page.getByRole('listitem').first()).toHaveTextContent('HDMIケーブル');
  });

  it('条件に合うものがなければ、そのことを伝える', async () => {
    mount(itemsPageSandbox);

    await search().fill('存在しない名前');

    await expect.element(page.getByText('条件に合う備品はありません。')).toBeVisible();
    await expect.element(page.getByText('5件中 0件を表示')).toBeVisible();
  });
});
