import { describe, expect, it, vi } from 'vitest';
import { createTermStore, uniqueTerms } from './termStore';

describe('uniqueTerms', () => {
  it('重複を除き、最初に出てきた順を保つ', () => {
    expect(uniqueTerms(['DOM', 'レイアウト', 'DOM'])).toEqual(['DOM', 'レイアウト']);
  });
});

describe('createTermStore', () => {
  it('載せた用語が一覧に出る', () => {
    const store = createTermStore();
    store.add('DOM');
    store.add('レイアウト');
    expect(store.getSnapshot()).toEqual(['DOM', 'レイアウト']);
  });

  it('同じ用語を2回載せたら、両方取り下げるまで残る', () => {
    const store = createTermStore();
    const removeFirst = store.add('DOM');
    const removeSecond = store.add('DOM');
    removeFirst();
    expect(store.getSnapshot()).toEqual(['DOM']);
    removeSecond();
    expect(store.getSnapshot()).toEqual([]);
  });

  it('変わったときだけ購読者に知らせ、変わらなければ同じ配列を返す', () => {
    const store = createTermStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    store.add('DOM');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot()).toBe(store.getSnapshot());

    unsubscribe();
    store.add('レイアウト');
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
