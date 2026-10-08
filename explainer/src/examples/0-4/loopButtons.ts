// ループの中で、ボタンを3つずつ作る。違いは、数える変数を var で作るか、let で作るかだけ。
export function startLoopButtons(root: HTMLElement): void {
  const output = document.createElement('p');
  output.textContent = '（ボタンを押すと、ここに番号が出ます）';

  const varButtons = document.createElement('p');
  // eslint-disable-next-line no-var -- var と let の違いを見るための実験
  for (var i = 0; i < 3; i++) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `var の ${i} 番`;
    button.addEventListener('click', () => {
      output.textContent = `押されたのは ${i} 番です`;
    });
    varButtons.append(button, ' ');
  }

  const letButtons = document.createElement('p');
  for (let j = 0; j < 3; j++) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `let の ${j} 番`;
    button.addEventListener('click', () => {
      output.textContent = `押されたのは ${j} 番です`;
    });
    letButtons.append(button, ' ');
  }

  root.append(varButtons, letButtons, output);
}
