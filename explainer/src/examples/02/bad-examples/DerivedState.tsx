// 教材用の悪い例：操作のあとで、画面の中の表示どうしが合わなくなることがある。
// どこが原因かは、解説ページの本文で考える（ここには答えを書かない）。
import { useState } from 'react';
import { filterItems } from '../filterItems';
import { initialItems, type Category } from '../items';

export function DerivedState() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [visibleItems, setVisibleItems] = useState(initialItems);
  const [count, setCount] = useState(initialItems.length);

  function changeQuery(nextQuery: string) {
    setQuery(nextQuery);
    const filtered = filterItems(initialItems, { query: nextQuery, category, sortByName: false });
    setVisibleItems(filtered);
    setCount(filtered.length);
  }

  function changeCategory(nextCategory: Category | 'all') {
    setCategory(nextCategory);
    const filtered = filterItems(initialItems, { query, category: nextCategory, sortByName: false });
    setVisibleItems(filtered);
  }

  return (
    <div>
      <p>
        <label>
          名前で検索 <input value={query} onChange={(event) => changeQuery(event.target.value)} />
        </label>{' '}
        <label>
          <input type="checkbox" checked={category === 'book'} onChange={(event) => changeCategory(event.target.checked ? 'book' : 'all')} />{' '}
          本だけ
        </label>
      </p>
      <p className="loan-summary">
        {initialItems.length}件中 {count}件を表示
      </p>
      <ul>
        {visibleItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
