export type TermStore = {
  /** 用語を1つ載せる。戻り値を呼ぶと、その1つを取り下げる */
  add: (term: string) => () => void;
  subscribe: (onChange: () => void) => () => void;
  getSnapshot: () => readonly string[];
};

// 重複を除き、最初に出てきた順に並べる。
export function uniqueTerms(terms: readonly string[]): readonly string[] {
  return [...new Set(terms)];
}

// ページ内の <Term> が載せた用語を集めておく場所。Reactの外に置く。
// <TermList> は useSyncExternalStore でここを読む。
export function createTermStore(): TermStore {
  let entries: readonly string[] = [];
  // 中身が変わらない限り同じ配列を返す（useSyncExternalStore は参照が変わったときだけ描き直す）。
  let snapshot: readonly string[] = [];
  const listeners = new Set<() => void>();

  function update(next: readonly string[]) {
    entries = next;
    snapshot = uniqueTerms(entries);
    for (const listener of listeners) listener();
  }

  return {
    add(term) {
      update([...entries, term]);
      return () => {
        const index = entries.indexOf(term);
        if (index !== -1) update(entries.toSpliced(index, 1));
      };
    },
    subscribe(onChange) {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    getSnapshot: () => snapshot,
  };
}
