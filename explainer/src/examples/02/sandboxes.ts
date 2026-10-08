import type { SandboxSpec } from '../../sandbox/types';
import derivedStateCode from './bad-examples/DerivedState.tsx?raw';
import syncWithEffectCode from './bad-examples/SyncWithEffect.tsx?raw';
import filterItemsCode from './filterItems.ts?raw';
import itemNamesCode from './ItemNames.tsx?raw';
import itemsCode from './items.ts?raw';
import itemsPageCode from './ItemsPage.tsx?raw';
import searchBoxCode from './SearchBox.tsx?raw';
import searchFieldCode from './SearchField.tsx?raw';

const shared = [
  { name: 'filterItems.ts', code: filterItemsCode },
  { name: 'items.ts', code: itemsCode },
];

export const searchFieldSandbox: SandboxSpec = {
  files: [{ name: 'SearchField.tsx', code: searchFieldCode }],
  entry: 'SearchField.tsx',
  component: 'SearchField',
};

export const derivedStateSandbox: SandboxSpec = {
  files: [{ name: 'DerivedState.tsx', code: derivedStateCode }, ...shared],
  entry: 'DerivedState.tsx',
  component: 'DerivedState',
};

export const syncWithEffectSandbox: SandboxSpec = {
  files: [{ name: 'SyncWithEffect.tsx', code: syncWithEffectCode }, ...shared],
  entry: 'SyncWithEffect.tsx',
  component: 'SyncWithEffect',
};

export const itemsPageSandbox: SandboxSpec = {
  files: [
    { name: 'ItemsPage.tsx', code: itemsPageCode },
    { name: 'SearchBox.tsx', code: searchBoxCode },
    { name: 'ItemNames.tsx', code: itemNamesCode },
    ...shared,
  ],
  entry: 'ItemsPage.tsx',
  component: 'ItemsPage',
};
