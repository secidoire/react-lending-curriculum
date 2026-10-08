import type { SandboxSpec } from '../../sandbox/types';
import lendFormNoCheckCode from './bad-examples/LendFormNoCheck.tsx?raw';
import formFieldCode from './FormField.tsx?raw';
import itemsCode from './items.ts?raw';
import lendFormCode from './LendForm.tsx?raw';
import lendFormSchemaCode from './lendFormSchema.ts?raw';
import lendPageCode from './LendPage.tsx?raw';
import loanListCode from './LoanList.tsx?raw';
import periodCode from './period.ts?raw';

const shared = [
  { name: 'period.ts', code: periodCode },
  { name: 'items.ts', code: itemsCode },
];

export const lendFormNoCheckSandbox: SandboxSpec = {
  files: [{ name: 'LendFormNoCheck.tsx', code: lendFormNoCheckCode }, ...shared],
  entry: 'LendFormNoCheck.tsx',
  component: 'LendFormNoCheck',
};

export const lendPageSandbox: SandboxSpec = {
  files: [
    { name: 'lendFormSchema.ts', code: lendFormSchemaCode },
    { name: 'LendForm.tsx', code: lendFormCode },
    { name: 'FormField.tsx', code: formFieldCode },
    { name: 'LendPage.tsx', code: lendPageCode },
    { name: 'LoanList.tsx', code: loanListCode },
    ...shared,
  ],
  entry: 'LendPage.tsx',
  component: 'LendPage',
};
