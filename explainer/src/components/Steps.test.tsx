import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { PresentModeContext } from './PresentModeContext';
import { Steps } from './Steps';

function renderSteps(present: boolean) {
  return render(
    <PresentModeContext value={present}>
      <Steps>
        <p>1つ目</p>
        <p>2つ目</p>
        <p>3つ目</p>
      </Steps>
    </PresentModeContext>,
  );
}

test('読むモードでは、最初からすべて表示する', async () => {
  const screen = await renderSteps(false);

  await expect.element(screen.getByText('3つ目')).toBeVisible();
  await expect.element(screen.getByRole('button', { name: /次へ/ })).not.toBeInTheDocument();
});

test('発表モードでは、「次へ」を押すたびに1つずつ表示する', async () => {
  const screen = await renderSteps(true);
  const next = screen.getByRole('button', { name: /次へ/ });

  await expect.element(screen.getByText('1つ目')).toBeVisible();
  await expect.element(screen.getByText('2つ目')).not.toBeInTheDocument();

  await next.click();
  await expect.element(screen.getByText('2つ目')).toBeVisible();
  await expect.element(screen.getByText('3つ目')).not.toBeInTheDocument();

  await next.click();
  await expect.element(screen.getByText('3つ目')).toBeVisible();
  await expect.element(next).not.toBeInTheDocument();
});

test('発表モードでは、→キーでも進む', async () => {
  const screen = await renderSteps(true);

  await userEvent.keyboard('{ArrowRight}');
  await expect.element(screen.getByText('2つ目')).toBeVisible();
});
