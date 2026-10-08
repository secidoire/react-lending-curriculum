import { describe, expect, it } from 'vitest';
import { parseLineRanges } from './parseLineRanges';

describe('parseLineRanges', () => {
  it('メタが無ければ空になる', () => {
    expect(parseLineRanges('')).toEqual([]);
    expect(parseLineRanges('title="a.js"')).toEqual([]);
  });

  it('1行だけの指定を読む', () => {
    expect(parseLineRanges('{2}')).toEqual([2]);
  });

  it('範囲とカンマ区切りを読む', () => {
    expect(parseLineRanges('{2-3,5}')).toEqual([2, 3, 5]);
  });

  it('重なった指定は1つにまとめ、昇順で返す', () => {
    expect(parseLineRanges('{4, 1-2, 2-3}')).toEqual([1, 2, 3, 4]);
  });
});
