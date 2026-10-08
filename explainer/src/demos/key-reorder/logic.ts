export type Item = { id: string; name: string };

/** none：keyを書かない ／ index：配列の中の位置をkeyにする ／ id：データのidをkeyにする */
export type KeyMode = 'none' | 'index' | 'id';

export const initialItems: readonly Item[] = [
  { id: 'item-1', name: 'リーダブルコード' },
  { id: 'item-2', name: 'プロジェクター' },
  { id: 'item-3', name: 'HDMIケーブル' },
  { id: 'item-4', name: '延長コード' },
];

export function prepend(items: readonly Item[], nextNumber: number): Item[] {
  return [{ id: `item-${nextNumber}`, name: `備品${nextNumber}` }, ...items];
}

export function reverse(items: readonly Item[]): Item[] {
  return [...items].reverse();
}

// random は 0以上1未満の数を返す関数。テストでは決まった値を返すものを渡す。
export function shuffle(items: readonly Item[], random: () => number): Item[] {
  const shuffled = [...items];
  for (let last = shuffled.length - 1; last > 0; last -= 1) {
    const picked = Math.floor(random() * (last + 1));
    const a = shuffled[last];
    const b = shuffled[picked];
    if (a === undefined || b === undefined) continue;
    shuffled[last] = b;
    shuffled[picked] = a;
  }
  return shuffled;
}

// 画面に出す、keyの値の説明。
export function describeKey(mode: KeyMode, item: Item, index: number): string {
  if (mode === 'none') return 'key なし';
  return `key=${mode === 'index' ? index : item.id}`;
}

// 行が最初に作られたときの備品名と、いま表示している備品名が違えば「ずれ」。
export function isMisaligned(nameWhenCreated: string, currentName: string): boolean {
  return nameWhenCreated !== currentName;
}
