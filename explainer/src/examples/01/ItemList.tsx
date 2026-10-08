import { ItemRow } from './ItemRow';
import type { Item } from './items';

type Props = { items: readonly Item[] };

// 備品の一覧（表）。
export function ItemList({ items }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>名前</th>
          <th>種類</th>
          <th>状態</th>
          <th>借りている人</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </tbody>
    </table>
  );
}
