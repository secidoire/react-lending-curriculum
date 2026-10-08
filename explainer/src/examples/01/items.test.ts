import { expect, it } from 'vitest';
import { countByCategory, initialItems } from './items';

it('countByCategory は、カテゴリごとの件数を返す', () => {
  expect(countByCategory(initialItems, 'book')).toBe(2);
  expect(countByCategory(initialItems, 'equipment')).toBe(3);
  expect(countByCategory([], 'book')).toBe(0);
});
