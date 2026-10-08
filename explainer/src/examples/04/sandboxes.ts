import type { SandboxSpec } from '../../sandbox/types';
import looseLoansCode from './bad-examples/LooseLoans.tsx?raw';
import initialLoansCode from './initialLoans.ts?raw';
import loanCode from './loan.ts?raw';
import loanBoardCode from './LoanBoard.tsx?raw';
import loanRowCode from './LoanRow.tsx?raw';
import loansReducerCode from './loansReducer.ts?raw';

export const looseLoansSandbox: SandboxSpec = {
  files: [{ name: 'LooseLoans.tsx', code: looseLoansCode }],
  entry: 'LooseLoans.tsx',
  component: 'LooseLoans',
};

export const loanBoardSandbox: SandboxSpec = {
  files: [
    { name: 'loan.ts', code: loanCode },
    { name: 'loansReducer.ts', code: loansReducerCode },
    { name: 'LoanBoard.tsx', code: loanBoardCode },
    { name: 'LoanRow.tsx', code: loanRowCode },
    { name: 'initialLoans.ts', code: initialLoansCode },
  ],
  entry: 'LoanBoard.tsx',
  component: 'LoanBoard',
};
