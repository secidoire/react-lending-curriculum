import type { Category, Item } from './items';

// 一覧の見せ方を決める条件。画面のstateは、この3つだけ。
export type Criteria = {
  query: string;
  category: Category | 'all';
  sortByName: boolean;
};

export const initialCriteria: Criteria = { query: '', category: 'all', sortByName: false };

// 条件に合う備品を、条件どおりの順で返す。渡された配列は書き換えない。
export function filterItems(items: readonly Item[], criteria: Criteria): Item[] {
  const query = criteria.query.trim().toLowerCase();
  const matched = items.filter(
    (item) =>
      item.name.toLowerCase().includes(query) && (criteria.category === 'all' || item.category === criteria.category),
  );
  return criteria.sortByName ? matched.sort((a, b) => a.name.localeCompare(b.name, 'ja')) : matched;
}
