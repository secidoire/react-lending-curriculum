import { describe, expect, it } from 'vitest';
import { daysOfPeriod, formatDate } from './period';

describe('formatDate', () => {
  it('日付の文字列を、年/月/日の表示にする', () => {
    expect(formatDate('2026-10-12')).toBe('2026/10/12');
  });

  it('日付として読めない文字列を渡すと、Invalid Date になる', () => {
    expect(formatDate('')).toBe('Invalid Date');
  });
});

describe('daysOfPeriod', () => {
  it('同じ日なら1日間、翌日までなら2日間', () => {
    expect(daysOfPeriod('2026-10-12', '2026-10-12')).toBe(1);
    expect(daysOfPeriod('2026-10-12', '2026-10-13')).toBe(2);
    expect(daysOfPeriod('2026-10-30', '2026-11-02')).toBe(4);
  });

  it('前後が逆だと0以下、日付として読めないと NaN になる', () => {
    expect(daysOfPeriod('2026-10-12', '2026-10-10')).toBe(-1);
    expect(daysOfPeriod('', '2026-10-10')).toBeNaN();
  });
});
