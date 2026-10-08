import type { SandboxSpec } from '../../sandbox/types';
import allInOneCode from './bad-examples/AllInOne.tsx?raw';
import categoryBadgeCode from './CategoryBadge.tsx?raw';
import itemListCode from './ItemList.tsx?raw';
import itemRowCode from './ItemRow.tsx?raw';
import itemsCode from './items.ts?raw';
import itemsPageCode from './ItemsPage.tsx?raw';
import lentItemsCode from './LentItems.tsx?raw';
import selectableListCode from './SelectableList.tsx?raw';
import selectableRowCode from './SelectableRow.tsx?raw';
import statusCellsCode from './StatusCells.tsx?raw';

const items = { name: 'items.ts', code: itemsCode };

export const allInOneSandbox: SandboxSpec = {
  files: [{ name: 'AllInOne.tsx', code: allInOneCode }, items],
  entry: 'AllInOne.tsx',
  component: 'AllInOne',
};

// タブは、画面全体 → 中の部品、の順に並べる。
export const itemsPageSandbox: SandboxSpec = {
  files: [
    { name: 'ItemsPage.tsx', code: itemsPageCode },
    { name: 'ItemList.tsx', code: itemListCode },
    { name: 'ItemRow.tsx', code: itemRowCode },
    { name: 'CategoryBadge.tsx', code: categoryBadgeCode },
    { name: 'StatusCells.tsx', code: statusCellsCode },
    { name: 'LentItems.tsx', code: lentItemsCode },
    items,
  ],
  entry: 'ItemsPage.tsx',
  component: 'ItemsPage',
};

export const selectableListSandbox: SandboxSpec = {
  files: [
    { name: 'SelectableList.tsx', code: selectableListCode },
    { name: 'SelectableRow.tsx', code: selectableRowCode },
    items,
  ],
  entry: 'SelectableList.tsx',
  component: 'SelectableList',
};
