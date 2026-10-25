import { describe, expect, it } from 'vitest';
import { startListWithBugs } from './bad-examples/listWithBugs';
import { startManual } from './manual';
import { startRerender } from './rerender';

// 意図的な状態管理の悪い例でも、フォーム値は HTML として解釈しない。
describe.each([startManual, startRerender, startListWithBugs])('form input remains text', (start) => {
  it('renders markup literally without creating attacker-controlled elements', () => {
    const root = document.createElement('div');
    document.body.replaceChildren(root);
    start(root);
    const payload = '<img src=x onerror="document.body.dataset.compromised=1">';
    const item = root.querySelector('input[name="itemName"]');
    const user = root.querySelector('input[name="userName"]');
    const form = root.querySelector('form');
    if (!(item instanceof HTMLInputElement) || !(user instanceof HTMLInputElement) || form === null) {
      throw new Error('Loan form is missing');
    }
    item.value = payload;
    user.value = payload;
    form.requestSubmit();
    expect(root.querySelector('tbody')?.textContent).toContain(payload);
    expect(root.querySelectorAll('img, script, iframe')).toHaveLength(0);
    expect(document.body.dataset.compromised).toBeUndefined();
  });
});
