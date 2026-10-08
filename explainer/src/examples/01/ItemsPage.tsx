import { CategoryBadge } from './CategoryBadge';
import { ItemList } from './ItemList';
import { countByCategory, initialItems } from './items';
import { LentItems } from './LentItems';

// 画面全体。部品を並べ、データ（items）を渡すだけ。
export function ItemsPage() {
  const items = initialItems;

  return (
    <div>
      <p className="loan-summary">
        <CategoryBadge category="book" /> {countByCategory(items, 'book')}件・
        <CategoryBadge category="equipment" /> {countByCategory(items, 'equipment')}件
      </p>
      <ItemList items={items} />
      <LentItems items={items} />
    </div>
  );
}
