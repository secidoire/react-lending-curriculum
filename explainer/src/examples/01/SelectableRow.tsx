import type { Item } from './items';

type Props = {
  item: Item;
  selected: boolean;
  onSelect: () => void;
};

export function SelectableRow({ item, selected, onSelect }: Props) {
  // この関数が呼ばれた（レンダーされた）ことを、コンソールに出す。
  console.log(`SelectableRow（${item.name}）を呼んだ。selected = ${selected}`);

  return (
    <tr className={selected ? 'row-selected' : undefined}>
      <td>{item.name}</td>
      <td>{selected && '選択中'}</td>
      <td>
        <input size={10} aria-label={`${item.name}のメモ`} />
      </td>
      <td>
        <button type="button" onClick={onSelect}>
          選ぶ
        </button>
      </td>
    </tr>
  );
}
