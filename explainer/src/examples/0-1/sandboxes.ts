import findCode from '../find.ts?raw';
import type { SandboxSpec } from '../../sandbox/types';
import appendRowsCode from './appendRows.ts?raw';
import benchmarkCode from './benchmark.ts?raw';
import colorAndWidthCode from './colorAndWidth.ts?raw';

// ページに載せる「コードと実行結果」の組。コードは、実際のファイルの中身をそのまま渡す。
const find = { name: 'find.ts', code: findCode };

export const colorAndWidthSandbox: SandboxSpec = {
  files: [{ name: 'colorAndWidth.ts', code: colorAndWidthCode }, find],
  entry: 'colorAndWidth.ts',
  start: 'startColorAndWidth',
};

export const benchmarkSandbox: SandboxSpec = {
  files: [{ name: 'appendRows.ts', code: appendRowsCode }, { name: 'benchmark.ts', code: benchmarkCode }, find],
  entry: 'benchmark.ts',
  start: 'startBenchmark',
};
