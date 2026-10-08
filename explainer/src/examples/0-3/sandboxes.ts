import type { SandboxSpec } from '../../sandbox/types';
import finalMiniReactCode from '../../shared-mini-react/miniReact.ts?raw';
import appCode from './app.ts?raw';
import appJsxCode from './appJsx.tsx?raw';
import firstTreeCode from './firstTree.ts?raw';
import v1MiniReactCode from './v1/miniReact.ts?raw';
import v2MiniReactCode from './v2/miniReact.ts?raw';

// 同じ app.ts を、ミニReactの中身だけ替えて動かす。どの枠でも、ミニReactは miniReact.ts という名前で渡す。
const app = { name: 'app.ts', code: appCode };

export const firstTreeSandbox: SandboxSpec = {
  files: [
    { name: 'firstTree.ts', code: firstTreeCode },
    { name: 'miniReact.ts', code: v1MiniReactCode },
  ],
  entry: 'firstTree.ts',
  start: 'startFirstTree',
};

// その1：毎回すべて作り直す。
export const fullRedrawSandbox: SandboxSpec = {
  files: [app, { name: 'miniReact.ts', code: v1MiniReactCode }],
  entry: 'app.ts',
  start: 'startApp',
};

// その2：前回と比べて、違うところだけ直す（子は位置で対応づける）。その1から変わった行に印を付ける。
export const diffByIndexSandbox: SandboxSpec = {
  files: [app, { name: 'miniReact.ts', code: v2MiniReactCode, changedFrom: v1MiniReactCode }],
  entry: 'app.ts',
  start: 'startApp',
};

// 完成版：子を key で対応づけられる。app.ts にはまだ key を書いていない（読者が足す）。その2から変わった行に印を付ける。
export const keyedSandbox: SandboxSpec = {
  files: [app, { name: 'miniReact.ts', code: finalMiniReactCode, changedFrom: v2MiniReactCode }],
  entry: 'app.ts',
  start: 'startApp',
};

export const jsxSandbox: SandboxSpec = {
  files: [
    { name: 'appJsx.tsx', code: appJsxCode },
    { name: 'miniReact.ts', code: finalMiniReactCode },
  ],
  entry: 'appJsx.tsx',
  start: 'startAppJsx',
  jsxPragma: 'h',
};
