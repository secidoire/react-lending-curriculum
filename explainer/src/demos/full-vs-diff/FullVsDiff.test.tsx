import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { FullVsDiff } from './FullVsDiff';

test('1行目の状態を切り替えると、全部作り直す側は行をすべて作り直し、違うところだけ直す側は文字を1か所だけ変える', async () => {
  const screen = await render(<FullVsDiff />);
  const full = screen.getByRole('region', { name: '全部作り直す' });
  const diff = screen.getByRole('region', { name: '違うところだけ直す' });
  // 属性の数は見ない。テストの道具が要素を探すときに入力欄へ属性を付け外しすることがあり、それも数えられてしまうため。
  await expect.element(full.getByText(/追加 0・削除 0・属性 \d+・文字 0/)).toBeVisible();

  await screen.getByRole('button', { name: '1行目の状態を切り替える' }).click();

  // 全部作り直す側：表をまるごと1つ取り除き、まるごと1つ足す。
  await expect.element(full.getByText(/追加 1・削除 1・属性 \d+・文字 0/)).toBeVisible();
  // 違うところだけ直す側：文字を1か所書き換えるだけ。
  await expect.element(diff.getByText(/追加 0・削除 0・属性 \d+・文字 1/)).toBeVisible();
});

test('メモ欄に入力中に自動で切り替わると、全部作り直す側は入力とフォーカスを失い、違うところだけ直す側は保つ', async () => {
  const screen = await render(<FullVsDiff />);
  const full = screen.getByRole('region', { name: '全部作り直す' });
  const diff = screen.getByRole('region', { name: '違うところだけ直す' });
  await screen.getByRole('button', { name: /自動で切り替える/ }).click();

  await diff.getByLabelText('メモ欄3').fill('来週返す');
  await expect.element(diff.getByText('フォーカス：メモ欄3')).toBeVisible();
  // 自動の切り替えが少なくとも1回起きるまで待つ。
  await expect.element(diff.getByRole('row', { name: /リーダブルコード.*返却済/ })).toBeVisible();
  await expect.element(diff.getByLabelText('メモ欄3')).toHaveValue('来週返す');
  await expect.element(diff.getByText('フォーカス：メモ欄3')).toBeVisible();

  await full.getByLabelText('メモ欄3').fill('来週返す');
  await expect.element(full.getByText('フォーカス：メモ欄3')).toBeVisible();
  await expect.element(full.getByText('フォーカス：なし')).toBeVisible();
  await expect.element(full.getByLabelText('メモ欄3')).toHaveValue('');
});
