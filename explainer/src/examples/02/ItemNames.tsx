import type { Item } from './items';

type Props = { items: readonly Item[] };

// 渡された備品を、そのまま並べるだけ。絞り込みのことは知らない。
export function ItemNames({ items }: Props) {
  if (items.length === 0) return <p>条件に合う備品はありません。</p>;

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
