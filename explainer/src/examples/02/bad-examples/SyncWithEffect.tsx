// 教材用の悪い例。何が問題かは、解説ページの本文で考える（ここには答えを書かない）。
import { useEffect, useState } from 'react';
import { filterItems } from '../filterItems';
import { initialItems, type Category } from '../items';

export function SyncWithEffect() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [visibleItems, setVisibleItems] = useState(initialItems);

  useEffect(() => {
    setVisibleItems(filterItems(initialItems, { query, category, sortByName: false }));
  }, [query, category]);

  console.log(`レンダーした。本だけ = ${category === 'book'}、表示する件数 = ${visibleItems.length}`);

  return (
    <div>
      <p>
        <label>
          名前で検索 <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>{' '}
        <label>
          <input type="checkbox" checked={category === 'book'} onChange={(event) => setCategory(event.target.checked ? 'book' : 'all')} />{' '}
          本だけ
        </label>
      </p>
      <p className="loan-summary">
        {initialItems.length}件中 {visibleItems.length}件を表示
      </p>
      <ul>
        {visibleItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
