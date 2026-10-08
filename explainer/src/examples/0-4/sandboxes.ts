import type { SandboxSpec } from '../../sandbox/types';
import pushLoansCode from './bad-examples/PushLoans.tsx?raw';
import compareUpdatesCode from './compareUpdates.ts?raw';
import counterCode from './Counter.tsx?raw';
import delayedCountCode from './DelayedCount.tsx?raw';
import loopButtonsCode from './loopButtons.ts?raw';
import objectIsCode from './objectIs.ts?raw';
import updatesCode from './updates.ts?raw';

export const counterSandbox: SandboxSpec = {
  files: [{ name: 'Counter.tsx', code: counterCode }],
  entry: 'Counter.tsx',
  component: 'Counter',
};

export const pushLoansSandbox: SandboxSpec = {
  files: [{ name: 'PushLoans.tsx', code: pushLoansCode }],
  entry: 'PushLoans.tsx',
  component: 'PushLoans',
};

export const objectIsSandbox: SandboxSpec = {
  files: [{ name: 'objectIs.ts', code: objectIsCode }],
  entry: 'objectIs.ts',
  start: 'startObjectIs',
};

export const compareUpdatesSandbox: SandboxSpec = {
  files: [
    { name: 'updates.ts', code: updatesCode },
    { name: 'compareUpdates.ts', code: compareUpdatesCode },
  ],
  entry: 'compareUpdates.ts',
  start: 'startCompareUpdates',
};

export const delayedCountSandbox: SandboxSpec = {
  files: [{ name: 'DelayedCount.tsx', code: delayedCountCode }],
  entry: 'DelayedCount.tsx',
  component: 'DelayedCount',
};

export const loopButtonsSandbox: SandboxSpec = {
  files: [{ name: 'loopButtons.ts', code: loopButtonsCode }],
  entry: 'loopButtons.ts',
  start: 'startLoopButtons',
};
