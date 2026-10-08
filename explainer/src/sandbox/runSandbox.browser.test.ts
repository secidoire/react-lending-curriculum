import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { runSandbox, startSandbox } from './runSandbox';

describe('runSandbox', () => {
  it('TypeScriptの型注釈を取り除いて実行し、export を返す', () => {
    const exported = runSandbox(
      [{ name: 'main.ts', code: 'export function double(value: number): number { return value * 2; }' }],
      'main.ts',
    );

    expect(typeof exported.double).toBe('function');
  });

  it('同じ例の中のファイルを、フォルダや拡張子の書き方によらず import できる', () => {
    const files = [
      { name: 'main.ts', code: "import { name } from '../names';\nexport const greeting = `こんにちは、${name}`;" },
      { name: 'names.ts', code: "export const name: string = '佐藤';" },
    ];

    expect(runSandbox(files, 'main.ts').greeting).toBe('こんにちは、佐藤');
  });

  it('例の中にないファイルを import すると、わかる言葉で止まる', () => {
    const files = [{ name: 'main.ts', code: "import { x } from './missing';\nexport const y = x;" }];

    expect(() => runSandbox(files, 'main.ts')).toThrow('./missing');
  });

  it('JSXを、指定した関数の呼び出しに変換する', () => {
    const files = [
      {
        name: 'main.tsx',
        code: "const h = (type: string, props: unknown, ...children: unknown[]) => ({ type, props, children });\nexport const node = <p className=\"a\">文</p>;",
      },
    ];

    expect(runSandbox(files, 'main.tsx', 'h').node).toEqual({ type: 'p', props: { className: 'a' }, children: ['文'] });
  });
});

describe('startSandbox', () => {
  it('start 関数を呼んで、渡した要素の中に例を組み立てる', () => {
    const root = document.createElement('div');
    root.textContent = '前の実行の残り';
    const files = [
      { name: 'main.ts', code: "export function start(root: HTMLElement) { root.append('動いた'); }" },
    ];

    startSandbox({ entry: 'main.ts', start: 'start' }, files, root);

    expect(root.textContent).toBe('動いた');
  });

  it('start 関数が後片づけの関数を返したら、それをそのまま返す', () => {
    const root = document.createElement('div');
    const files = [
      {
        name: 'main.ts',
        code: "export function start(root: HTMLElement) { root.append('動作中'); return () => { root.textContent = '片づけた'; }; }",
      },
    ];

    const cleanup = startSandbox({ entry: 'main.ts', start: 'start' }, files, root);
    expect(root.textContent).toBe('動作中');

    cleanup();
    expect(root.textContent).toBe('片づけた');
  });

  it('component を指定すると、Reactのコンポーネントとして描画し、後片づけで取り除く', async () => {
    const root = document.createElement('div');
    document.body.replaceChildren(root);
    const files = [
      {
        name: 'App.tsx',
        code: "import { useState } from 'react';\nexport function App() { const [count, setCount] = useState(0); return <button onClick={() => setCount(count + 1)}>{count}回</button>; }",
      },
    ];

    const cleanup = startSandbox({ entry: 'App.tsx', component: 'App' }, files, root);
    await expect.element(page.getByRole('button', { name: '0回' })).toBeVisible();

    await page.getByRole('button', { name: '0回' }).click();
    await expect.element(page.getByRole('button', { name: '1回' })).toBeVisible();

    cleanup();
    expect(root.textContent).toBe('');
  });

  it('start 関数が無いと、わかる言葉で止まる', () => {
    const root = document.createElement('div');

    const files = [{ name: 'main.ts', code: 'export const x = 1;' }];

    expect(() => startSandbox({ entry: 'main.ts', start: 'start' }, files, root)).toThrow('export function start(root)');
  });
});
