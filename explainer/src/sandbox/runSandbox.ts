import { transform } from 'sucrase';
import { moduleName } from './moduleName';
import type { SandboxFile } from './types';

type Module = { exports: Record<string, unknown> };

// ページの上で書き換えられたコードを、その場で実行する。
// 1. TypeScript と import/export を、ブラウザがそのまま実行できる形に変換する（sucrase）
// 2. import は require() の呼び出しに変わるので、その require を自前で用意して、同じ例の中のファイルを渡す
// 戻り値は、entry のファイルが export しているもの。
export function runSandbox(files: readonly SandboxFile[], entry: string): Record<string, unknown> {
  const sources = new Map(files.map((file) => [moduleName(file.name), file.code]));
  const loaded = new Map<string, Module>();

  function require(specifier: string): Record<string, unknown> {
    const name = moduleName(specifier);
    const alreadyLoaded = loaded.get(name);
    if (alreadyLoaded !== undefined) return alreadyLoaded.exports;

    const source = sources.get(name);
    if (source === undefined) {
      throw new Error(`import しようとした「${specifier}」が、この例の中にありません`);
    }

    const module: Module = { exports: {} };
    loaded.set(name, module);
    const { code } = transform(source, { transforms: ['typescript', 'imports'] });
    // 書き換えられたコードを実行するために、文字列から関数を作る。読者が自分のブラウザで自分のコードを動かすだけなので許している。
    new Function('require', 'module', 'exports', code)(require, module, module.exports);
    return module.exports;
  }

  return require(entry);
}

// entry が export している start 関数を呼んで、root の中に例を組み立てる。
export function startSandbox(files: readonly SandboxFile[], entry: string, start: string, root: HTMLElement): void {
  const exported = runSandbox(files, entry)[start];
  if (typeof exported !== 'function') {
    throw new Error(`${entry} に、export function ${start}(root) がありません`);
  }
  root.replaceChildren();
  exported(root);
}
