import findCode from '../find.ts?raw';
import type { SandboxSpec } from '../../sandbox/types';
import listWithBugsCode from './bad-examples/listWithBugs.ts?raw';
import frameCode from './frame.ts?raw';
import loansCode from './loans.ts?raw';
import manualCode from './manual.ts?raw';
import rerenderCode from './rerender.ts?raw';

// ページに載せる「コードと実行結果」の組。コードは、実際のファイルの中身をそのまま渡す。
// 3つの版で共通のファイル（枠・データ・道具）は、うしろのタブに並べる。
const shared = [
  { name: 'frame.ts', code: frameCode },
  { name: 'loans.ts', code: loansCode },
  { name: 'find.ts', code: findCode },
];

export const listWithBugsSandbox: SandboxSpec = {
  files: [{ name: 'listWithBugs.ts', code: listWithBugsCode }, ...shared],
  entry: 'listWithBugs.ts',
  start: 'startListWithBugs',
};

export const manualSandbox: SandboxSpec = {
  files: [{ name: 'manual.ts', code: manualCode }, ...shared],
  entry: 'manual.ts',
  start: 'startManual',
};

export const rerenderSandbox: SandboxSpec = {
  files: [{ name: 'rerender.ts', code: rerenderCode }, ...shared],
  entry: 'rerender.ts',
  start: 'startRerender',
};
