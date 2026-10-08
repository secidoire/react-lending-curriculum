import { CategoryBadge } from './CategoryBadge';
import type { Item } from './items';

type Props = { items: readonly Item[] };

// いま貸出中のものの一覧。1件もなければ、何も出さない。
export function LentItems({ items }: Props) {
  const lentItems = items.filter((item) => item.lentTo !== null);
  if (lentItems.length === 0) return null;

  return (
    <>
      <p>いま貸出中のもの：</p>
      <ul>
        {lentItems.map((item) => (
          <li key={item.id}>
            {item.name} <CategoryBadge category={item.category} /> — {item.lentTo}さん
          </li>
        ))}
      </ul>
    </>
  );
}
