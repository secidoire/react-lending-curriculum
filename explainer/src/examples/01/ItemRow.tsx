import { CategoryBadge } from './CategoryBadge';
import type { Item } from './items';
import { StatusCells } from './StatusCells';

type Props = { item: Item };

// 一覧の1行。
export function ItemRow({ item }: Props) {
  return (
    <tr>
      <td>{item.name}</td>
      <td>
        <CategoryBadge category={item.category} />
      </td>
      <StatusCells lentTo={item.lentTo} />
    </tr>
  );
}
