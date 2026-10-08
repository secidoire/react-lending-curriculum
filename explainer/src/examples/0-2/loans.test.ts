import { describe, expect, it } from 'vitest';
import { initialLoans, summaryText } from './loans';

describe('summaryText', () => {
  it('全体の件数と、貸出中の件数を出す', () => {
    expect(summaryText(initialLoans)).toBe('全3件・貸出中1件');
  });

  it('0件のときも数字を出す', () => {
    expect(summaryText([])).toBe('全0件・貸出中0件');
  });
});
