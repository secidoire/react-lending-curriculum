import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { KeyReorder } from './KeyReorder';

test('先頭に追加すると、key なし・key=index では入力欄が別の備品にずれ、key=id ではずれない', async () => {
  const screen = await render(<KeyReorder />);
  const none = screen.getByRole('region', { name: 'key なし' });
  const byIndex = screen.getByRole('region', { name: 'key に位置（index）' });
  const byId = screen.getByRole('region', { name: 'key に id' });
  await expect.element(screen.getByText(/ずれ（もとは/).first()).not.toBeInTheDocument();

  await screen.getByRole('button', { name: '先頭に追加' }).click();

  // 位置で対応づけた2つ：1行目の入力欄は「リーダブルコードを借りる理由」のまま、備品名だけが「備品5」になる。
  for (const column of [none, byIndex]) {
    const firstRow = column.getByRole('listitem').first();
    await expect.element(firstRow.getByText('備品5', { exact: true })).toBeVisible();
    await expect.element(firstRow.getByRole('textbox')).toHaveValue('リーダブルコードを借りる理由');
    await expect.element(firstRow.getByText('ずれ（もとは「リーダブルコード」の行）')).toBeVisible();
  }

  // id で対応づけた一覧：新しい行が新しく作られ、もとの行は入力欄ごと下へ移る。
  const firstRow = byId.getByRole('listitem').first();
  await expect.element(firstRow.getByRole('textbox')).toHaveValue('備品5を借りる理由');
  await expect.element(byId.getByText(/ずれ（もとは/)).not.toBeInTheDocument();
});

test('逆順にしても、key=id の一覧では、入力した内容が同じ備品についていく', async () => {
  const screen = await render(<KeyReorder />);
  const byId = screen.getByRole('region', { name: 'key に id' });
  await byId.getByLabelText('リーダブルコードを借りる理由').fill('設計の勉強会で使う');

  await screen.getByRole('button', { name: '逆順にする' }).click();

  const lastRow = byId.getByRole('listitem').last();
  await expect.element(lastRow.getByText('リーダブルコード', { exact: true })).toBeVisible();
  await expect.element(lastRow.getByRole('textbox')).toHaveValue('設計の勉強会で使う');
});
