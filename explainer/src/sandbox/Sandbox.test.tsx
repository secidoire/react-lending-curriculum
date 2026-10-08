import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Sandbox } from './Sandbox';
import type { SandboxSpec } from './types';

const spec: SandboxSpec = {
  files: [
    {
      name: 'main.ts',
      code: "import { message } from './message';\nexport function start(root: HTMLElement) { root.append(message); }",
    },
    { name: 'message.ts', code: "export const message = '最初の表示';" },
  ],
  entry: 'main.ts',
  start: 'start',
};

test('コードを実行した結果を表示する', async () => {
  const screen = await render(<Sandbox spec={spec} />);

  await expect.element(screen.getByText('最初の表示')).toBeVisible();
});

test('ファイルはタブで切り替えられ、コードを書き換えると実行結果が変わる', async () => {
  const screen = await render(<Sandbox spec={spec} />);

  await screen.getByRole('tab', { name: 'message.ts' }).click();
  await screen.getByLabelText('message.ts のコード').fill("export const message = '書き換えた表示';");

  await expect.element(screen.getByText('書き換えた表示')).toBeVisible();
});

test('「最初に戻す」で、コードと実行結果が元に戻る', async () => {
  const screen = await render(<Sandbox spec={spec} />);
  await screen.getByRole('tab', { name: 'message.ts' }).click();
  await screen.getByLabelText('message.ts のコード').fill("export const message = '書き換えた表示';");
  await expect.element(screen.getByText('書き換えた表示')).toBeVisible();

  await screen.getByRole('button', { name: '最初に戻す' }).click();

  await expect.element(screen.getByText('最初の表示')).toBeVisible();
});

test('コードが壊れているときは、実行結果の代わりにエラーを出す', async () => {
  const screen = await render(<Sandbox spec={spec} />);

  await screen.getByLabelText('main.ts のコード').fill('export function start( {');

  await expect.element(screen.getByRole('alert')).toBeVisible();
});

test('codeClosed を付けると、コードは「コードを見る」を押すまで出ない', async () => {
  const screen = await render(<Sandbox spec={spec} codeClosed />);

  await expect.element(screen.getByText('最初の表示')).toBeVisible();
  await expect.element(screen.getByRole('tab', { name: 'main.ts' })).not.toBeInTheDocument();

  await screen.getByRole('button', { name: 'コードを見る' }).click();
  await expect.element(screen.getByRole('tab', { name: 'main.ts' })).toBeVisible();
});
