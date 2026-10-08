import { describe, expect, it } from 'vitest';
import { markChangedLines } from './changedLines';

describe('markChangedLines', () => {
  it('参照にない行だけに印を付ける', () => {
    const marked = markChangedLines('<table>\n<tbody>\n</table>', '<table>\n</table>');

    expect(marked).toEqual([
      { text: '<table>', changed: false },
      { text: '<tbody>', changed: true },
      { text: '</table>', changed: false },
    ]);
  });

  it('字下げだけが違う行は、同じとみなす', () => {
    expect(markChangedLines('    <tr></tr>', '  <tr></tr>')).toEqual([{ text: '    <tr></tr>', changed: false }]);
  });
});
