import { useState } from 'react';
import { initialItems } from './items';
import { SelectableRow } from './SelectableRow';

const items = initialItems.slice(0, 3);

// 行を1つ選べる一覧。どの行が選ばれているかを、state（selectedId）として持つ。
export function SelectableList() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  console.log(`SelectableList を呼んだ。selectedId = ${selectedId}`);

  return (
    <table>
      <tbody>
        {items.map((item) => (
          <SelectableRow
            key={item.id}
            item={item}
            selected={item.id === selectedId}
            onSelect={() => setSelectedId(item.id)}
          />
        ))}
      </tbody>
    </table>
  );
}
