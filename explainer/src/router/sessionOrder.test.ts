import { describe, expect, it } from 'vitest';
import { compareSessionIds, sessionIdFromPath } from './sessionOrder';

describe('sessionIdFromPath', () => {
  it('ファイル名から回のIDを作る', () => {
    expect(sessionIdFromPath('../sessions/0-3.mdx')).toBe('0-3');
    expect(sessionIdFromPath('../sessions/A-1.mdx')).toBe('A-1');
  });
});

describe('compareSessionIds', () => {
  it('第0部 → 第1部 → 発展編 の順に並ぶ', () => {
    const shuffled = ['A-2', '08', '0-4', '01', 'A-1', '0-1', '02', '0-3', '0-2'];
    expect(shuffled.sort(compareSessionIds)).toEqual([
      '0-1',
      '0-2',
      '0-3',
      '0-4',
      '01',
      '02',
      '08',
      'A-1',
      'A-2',
    ]);
  });
});
