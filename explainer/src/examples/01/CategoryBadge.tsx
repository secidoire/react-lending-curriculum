import type { Category } from './items';

type Props = { category: Category };

// 種類の表示。
export function CategoryBadge({ category }: Props) {
  if (category === 'book') {
    return <span className="badge badge-book">本</span>;
  }
  return <span className="badge badge-equipment">備品</span>;
}
