import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { StaleClosure } from './StaleClosure';

// タイマーを待つ時間を短くするために、間隔を縮めて動かす。
const INTERVAL_MS = 150;

// count は増え続けるので、「3以上になった」ことを確かめる。
const COUNT_3_OR_MORE = /^count = ([3-9]|\d{2,})$/;

test('バグ版：count は 1 で止まる。コールバックは、ずっと count を 0 だと見ている', async () => {
  const screen = await render(<StaleClosure intervalMs={INTERVAL_MS} />);
  const history = screen.getByRole('region', { name: 'レンダー履歴' });

  await expect.element(screen.getByText('count = 1', { exact: true })).toBeVisible();
  await expect.element(history.getByText(/タイマー1：レンダー#1で開始・動作中（[3-9]回呼ばれた）/)).toBeVisible();

  await expect.element(screen.getByText('count = 1', { exact: true })).toBeVisible();
  await expect.element(history.getByText('いちばん最近の呼び出し：count は 0 に見えている → setCount(0 + 1)')).toBeVisible();
  await expect.element(history.getByRole('listitem').filter({ hasText: '#3' })).not.toBeInTheDocument();
});

test('関数型更新：count は増え続ける。タイマーは作り直されない', async () => {
  const screen = await render(<StaleClosure intervalMs={INTERVAL_MS} />);
  await screen.getByRole('button', { name: '関数型更新' }).click();

  await expect.element(screen.getByText(COUNT_3_OR_MORE)).toBeVisible();
  await expect.element(screen.getByText(/タイマー1：レンダー#1で開始・動作中/)).toBeVisible();
  await expect.element(screen.getByText(/タイマー2/)).not.toBeInTheDocument();
});

test('依存配列にcount：count は増え続ける。そのたびにタイマーを止めて作り直す', async () => {
  const screen = await render(<StaleClosure intervalMs={INTERVAL_MS} />);
  await screen.getByRole('button', { name: '依存配列にcount' }).click();

  await expect.element(screen.getByText(COUNT_3_OR_MORE)).toBeVisible();
  // レンダーのたびに、前のタイマーは1回呼ばれただけで止められ、次のレンダーで新しいタイマーが作られる。
  await expect.element(screen.getByText(/タイマー\d+：レンダー#\d+で開始・× 停止（1回呼ばれた）/).first()).toBeVisible();
  await expect.element(screen.getByText(/タイマー([3-9]|\d{2,})：/).first()).toBeVisible();
});

test('useEffectEvent版：count は増え続ける。タイマーは1つのままで、コールバックは新しい count を見ている', async () => {
  const screen = await render(<StaleClosure intervalMs={INTERVAL_MS} />);
  await screen.getByRole('button', { name: 'useEffectEvent版' }).click();

  await expect.element(screen.getByText(COUNT_3_OR_MORE)).toBeVisible();
  await expect.element(screen.getByText(/count は [2-9] に見えている/)).toBeVisible();
  await expect.element(screen.getByText(/タイマー2/)).not.toBeInTheDocument();
});
