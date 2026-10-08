import { describe, expect, it } from 'vitest';
import { changedLineNumbers } from './changedLines';

describe('changedLineNumbers', () => {
  it('前のコードにない行の番号を、1始まりで返す', () => {
    const previous = 'function render() {\n  replaceAll();\n}';
    const code = 'function render() {\n  const old = remember();\n  update(old);\n}';

    expect(changedLineNumbers(code, previous)).toEqual([2, 3]);
  });

  it('字下げだけが違う行と、空行は数えない', () => {
    const previous = 'a();\nb();';
    const code = '    a();\n\n  b();\n';

    expect(changedLineNumbers(code, previous)).toEqual([]);
  });
});
