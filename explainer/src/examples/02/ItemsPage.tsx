import { useState } from 'react';
import { filterItems, initialCriteria } from './filterItems';
import { ItemNames } from './ItemNames';
import { initialItems } from './items';
import { SearchBox } from './SearchBox';

export function ItemsPage() {
  // stateは、利用者が決める「条件」だけ。
  const [criteria, setCriteria] = useState(initialCriteria);

  // 表示する一覧は、stateにしない。レンダーのたびに、条件から計算する。
  const visibleItems = filterItems(initialItems, criteria);

  return (
    <div>
      <SearchBox criteria={criteria} onChange={setCriteria} />
      <p className="loan-summary">
        {initialItems.length}件中 {visibleItems.length}件を表示
      </p>
      <ItemNames items={visibleItems} />
    </div>
  );
}
