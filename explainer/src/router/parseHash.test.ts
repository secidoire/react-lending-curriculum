import { describe, expect, it } from 'vitest';
import { formatHash, parseHash } from './parseHash';

describe('parseHash', () => {
  it('ハッシュが空ならページ一覧（sessionId は null）', () => {
    expect(parseHash('')).toEqual({ sessionId: null, present: false });
    expect(parseHash('#/')).toEqual({ sessionId: null, present: false });
  });

  it('回のIDを取り出す', () => {
    expect(parseHash('#/0-3')).toEqual({ sessionId: '0-3', present: false });
    expect(parseHash('#/A-1')).toEqual({ sessionId: 'A-1', present: false });
  });

  it('?present が付いていれば発表モード', () => {
    expect(parseHash('#/0-3?present')).toEqual({ sessionId: '0-3', present: true });
    expect(parseHash('#/?present')).toEqual({ sessionId: null, present: true });
  });

  it('知らないクエリは無視する', () => {
    expect(parseHash('#/02?foo=1')).toEqual({ sessionId: '02', present: false });
  });
});

describe('formatHash', () => {
  it('parseHash の逆になる', () => {
    for (const hash of ['#/', '#/0-3', '#/0-3?present', '#/?present']) {
      expect(formatHash(parseHash(hash))).toBe(hash);
    }
  });
});
