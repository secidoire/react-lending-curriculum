import { describe, expect, it } from 'vitest';
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
});

describe('startSandbox', () => {
  it('start 関数を呼んで、渡した要素の中に例を組み立てる', () => {
    const root = document.createElement('div');
    root.textContent = '前の実行の残り';
    const files = [
      { name: 'main.ts', code: "export function start(root: HTMLElement) { root.append('動いた'); }" },
    ];

    startSandbox(files, 'main.ts', 'start', root);

    expect(root.textContent).toBe('動いた');
  });

  it('start 関数が無いと、わかる言葉で止まる', () => {
    const root = document.createElement('div');

    expect(() => startSandbox([{ name: 'main.ts', code: 'export const x = 1;' }], 'main.ts', 'start', root)).toThrow(
      'export function start(root)',
    );
  });
});
