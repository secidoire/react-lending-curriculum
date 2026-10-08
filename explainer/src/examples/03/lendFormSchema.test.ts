import { describe, expect, it } from 'vitest';
import { parseLendForm } from './lendFormSchema';

const valid = { itemId: 'item-2', userName: '佐藤', from: '2026-10-12', to: '2026-10-14' };

describe('parseLendForm', () => {
  it('正しい入力は、LendRequest として返す', () => {
    expect(parseLendForm(valid)).toEqual({ ok: true, request: valid });
  });

  it('借りる人の前後の空白は取り除く', () => {
    expect(parseLendForm({ ...valid, userName: '  佐藤 ' })).toEqual({ ok: true, request: valid });
  });

  it('同じ日から同じ日までは、正しい', () => {
    expect(parseLendForm({ ...valid, to: valid.from }).ok).toBe(true);
  });

  it('空の欄は、欄ごとに理由を返す', () => {
    expect(parseLendForm({ itemId: '', userName: '  ', from: '', to: '' })).toEqual({
      ok: false,
      errors: {
        itemId: '備品を選んでください',
        userName: '借りる人を入力してください',
        from: '「いつから」の日付を入力してください',
        to: '「いつまで」の日付を入力してください',
      },
    });
  });

  it('「いつまで」が「いつから」より前なら、「いつまで」の欄の問題として返す', () => {
    expect(parseLendForm({ ...valid, to: '2026-10-10' })).toEqual({
      ok: false,
      errors: { to: '「いつまで」は、「いつから」と同じ日か、それより後にしてください' },
    });
  });

  it('存在しない日付や、形の違う値も通さない', () => {
    expect(parseLendForm({ ...valid, from: '2026-02-30' }).ok).toBe(false);
    expect(parseLendForm({ ...valid, from: 20261012 }).ok).toBe(false);
    expect(parseLendForm(null).ok).toBe(false);
  });
});
