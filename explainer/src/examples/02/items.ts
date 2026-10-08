export type Category = 'book' | 'equipment';

// この回の備品。lentTo は、借りている人の名前（誰も借りていなければ null）。
export type Item = {
  id: string;
  name: string;
  category: Category;
  lentTo: string | null;
};

export const initialItems: readonly Item[] = [
  { id: 'item-1', name: 'リーダブルコード', category: 'book', lentTo: '佐藤' },
  { id: 'item-2', name: 'プロジェクター', category: 'equipment', lentTo: null },
  { id: 'item-3', name: 'HDMIケーブル', category: 'equipment', lentTo: '高橋' },
  { id: 'item-4', name: 'Web API: The Good Parts', category: 'book', lentTo: null },
  { id: 'item-5', name: '延長コード', category: 'equipment', lentTo: null },
];

export function countByCategory(items: readonly Item[], category: Category): number {
  return items.filter((item) => item.category === category).length;
}
