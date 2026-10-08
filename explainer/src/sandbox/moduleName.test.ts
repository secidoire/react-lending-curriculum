import { describe, expect, it } from 'vitest';
import { moduleName } from './moduleName';

describe('moduleName', () => {
  it('フォルダと拡張子を取り除く', () => {
    expect(moduleName('./loans')).toBe('loans');
    expect(moduleName('../loans.ts')).toBe('loans');
    expect(moduleName('rerender.ts')).toBe('rerender');
    expect(moduleName('./bad-examples/listWithBugs.tsx')).toBe('listWithBugs');
  });
});
