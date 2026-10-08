import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Reveal } from './Reveal';

test('既定では閉じていて、ラベルを押すと答えが見える', async () => {
  const screen = await render(<Reveal>全部作り直したので、入力が消えた。</Reveal>);
  const answer = screen.getByText('全部作り直したので、入力が消えた。');

  await expect.element(answer).not.toBeVisible();

  await screen.getByText('答えを見る').click();
  await expect.element(answer).toBeVisible();
});

test('ラベルを変えられる', async () => {
  const screen = await render(<Reveal label="模範解答を見る">本文</Reveal>);

  await expect.element(screen.getByText('模範解答を見る')).toBeVisible();
});
