import * as React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import * as ReactDomClient from 'react-dom/client';
import { transform } from 'sucrase';
import { z } from 'zod';
import { moduleName } from './moduleName';
import type { SandboxFile, SandboxSpec } from './types';

type Module = { exports: Record<string, unknown> };
type Cleanup = () => void;

// 例のコードが import できる、枠の外のライブラリ。
const LIBRARIES: Record<string, unknown> = {
  react: React,
  'react/jsx-runtime': jsxRuntime,
  'react-dom/client': ReactDomClient,
};

// 例が export したものは、読者が書き換えたコードの結果なので、型はわからない。使う前に形を確かめる。
const StartSchema = z.custom<(root: HTMLElement) => unknown>((value) => typeof value === 'function');
const ComponentSchema = z.custom<React.ComponentType>((value) => typeof value === 'function');
const CleanupSchema = z.custom<Cleanup>((value) => typeof value === 'function');

// ページの上で書き換えられたコードを、その場で実行する。
// 1. TypeScript・JSX・import/export を、ブラウザがそのまま実行できる形に変換する（sucrase）
// 2. import は require() の呼び出しに変わるので、その require を自前で用意して、同じ例の中のファイルを渡す
// 戻り値は、entry のファイルが export しているもの。
export function runSandbox(
  files: readonly SandboxFile[],
  entry: string,
  jsxPragma?: string,
): Record<string, unknown> {
  const sources = new Map(files.map((file) => [moduleName(file.name), file.code]));
  const loaded = new Map<string, Module>();

  function require(specifier: string): unknown {
    if (specifier in LIBRARIES) return LIBRARIES[specifier];

    const name = moduleName(specifier);
    const alreadyLoaded = loaded.get(name);
    if (alreadyLoaded !== undefined) return alreadyLoaded.exports;

    const source = sources.get(name);
    if (source === undefined) {
      throw new Error(`import しようとした「${specifier}」が、この例の中にありません`);
    }

    const module: Module = { exports: {} };
    loaded.set(name, module);
    // JSXは、関数の呼び出しに変換される。jsxPragma があればその関数（<p>文</p> → h('p', null, '文')）、
    // なければReactの要素を作る関数の呼び出しになる。
    const { code } = transform(source, {
      transforms: ['typescript', 'jsx', 'imports'],
      production: true,
      ...(jsxPragma === undefined ? { jsxRuntime: 'automatic' } : { jsxRuntime: 'classic', jsxPragma }),
    });
    // 書き換えられたコードを実行するために、文字列から関数を作る。読者が自分のブラウザで自分のコードを動かすだけなので許している。
    new Function('require', 'module', 'exports', code)(require, module, module.exports);
    return module.exports;
  }

  const exported = require(entry);
  return typeof exported === 'object' && exported !== null ? { ...exported } : {};
}

function noop() {}

// 例を root の中で動かす。戻り値は、後片づけの関数（次に実行し直す前と、枠が消えるときに呼ぶ）。
// onError には、Reactが描いている途中で起きたエラーが渡される。
export function startSandbox(
  spec: Omit<SandboxSpec, 'files'>,
  files: readonly SandboxFile[],
  root: HTMLElement,
  onError: (error: unknown) => void = noop,
): Cleanup {
  const exported = runSandbox(files, spec.entry, spec.jsxPragma);
  // 実行のたびに新しい入れ物を作る。前の実行が残したものと混ざらないようにするため。
  const host = document.createElement('div');
  root.replaceChildren(host);

  if (spec.component !== undefined) {
    const component = ComponentSchema.safeParse(exported[spec.component]);
    if (!component.success) {
      throw new Error(`${spec.entry} に、export function ${spec.component}() がありません`);
    }
    const reactRoot = ReactDomClient.createRoot(host, { onUncaughtError: onError });
    reactRoot.render(React.createElement(component.data));
    return () => reactRoot.unmount();
  }

  const start = StartSchema.safeParse(exported[spec.start ?? '']);
  if (!start.success) {
    throw new Error(`${spec.entry} に、export function ${spec.start}(root) がありません`);
  }
  const cleanup = CleanupSchema.safeParse(start.data(host));
  return cleanup.success ? cleanup.data : noop;
}
