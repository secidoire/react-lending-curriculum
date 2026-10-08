import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { PresentModeContext } from './components/PresentModeContext';
import { SessionView } from './components/SessionView';
import { pages } from './router/pages';

// 全ページのスモークテスト。どちらのモードでも例外なく描画でき、必須の節があることを確かめる。
describe.each(pages)('$id $title', (page) => {
  test.each([
    ['読むモード', false],
    ['発表モード', true],
  ])('%sで描画できる', async (_label, present) => {
    const screen = await render(
      <PresentModeContext value={present}>
        <SessionView page={page} />
      </PresentModeContext>,
    );

    await expect.element(screen.getByRole('heading', { level: 1 })).toHaveTextContent(`${page.id} ${page.title}`);
    await expect.element(screen.getByRole('heading', { name: 'よくある誤解' })).toBeVisible();
    await expect.element(screen.getByRole('heading', { name: '次回の仕様変更予告' })).toBeVisible();
  });

  test('答えは最初は閉じている', async () => {
    const screen = await render(<SessionView page={page} />);

    expect(screen.container.querySelectorAll('details').length).toBeGreaterThan(0);
    expect(screen.container.querySelectorAll('details[open]')).toHaveLength(0);
  });
});
