export type Loan = { id: number; itemName: string; status: 'lent' | 'returned' };
export type DemoState = { loans: readonly Loan[]; nextId: number };

const ITEM_NAMES = ['リーダブルコード', 'プロジェクター', 'HDMIケーブル', '延長コード', '三脚'];

export const initialState: DemoState = {
  loans: ITEM_NAMES.map((itemName, index) => ({ id: index + 1, itemName, status: 'lent' })),
  nextId: ITEM_NAMES.length + 1,
};

export function addLoan(state: DemoState): DemoState {
  const loan: Loan = { id: state.nextId, itemName: `備品${state.nextId}`, status: 'lent' };
  return { loans: [...state.loans, loan], nextId: state.nextId + 1 };
}

export function toggleFirstStatus(state: DemoState): DemoState {
  const [first, ...rest] = state.loans;
  if (first === undefined) return state;
  return { ...state, loans: [{ ...first, status: first.status === 'lent' ? 'returned' : 'lent' }, ...rest] };
}

// DOMに加えられた変更の数。
export type Counts = { added: number; removed: number; attributes: number; text: number };

export const emptyCounts: Counts = { added: 0, removed: 0, attributes: 0, text: 0 };

// MutationObserver が知らせてくる記録のうち、数えるのに必要な部分。
export type MutationLike = {
  type: string;
  addedNodes: { length: number };
  removedNodes: { length: number };
};

export function countMutations(records: readonly MutationLike[]): Counts {
  const counts = { ...emptyCounts };
  for (const record of records) {
    if (record.type === 'childList') {
      counts.added += record.addedNodes.length;
      counts.removed += record.removedNodes.length;
    } else if (record.type === 'attributes') {
      counts.attributes += 1;
    } else if (record.type === 'characterData') {
      counts.text += 1;
    }
  }
  return counts;
}

export function addCounts(a: Counts, b: Counts): Counts {
  return {
    added: a.added + b.added,
    removed: a.removed + b.removed,
    attributes: a.attributes + b.attributes,
    text: a.text + b.text,
  };
}

export function formatCounts(counts: Counts): string {
  return `追加 ${counts.added}・削除 ${counts.removed}・属性 ${counts.attributes}・文字 ${counts.text}`;
}

// いまフォーカスがある入力欄の名前（なければ null）から、表示する文を作る。
export function formatFocus(label: string | null): string {
  return `フォーカス：${label ?? 'なし'}`;
}
