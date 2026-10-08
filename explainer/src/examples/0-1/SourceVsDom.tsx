import { useEffect, useRef, useState } from 'react';
import { markChangedLines } from './changedLines';
import { describeDom } from './describeDom';
import { loadPage, renameBorrower, SOURCE_HTML } from './page';

// ファイルの中身（変わらない）と、いまのDOM（変わる）を並べて見せる。
export function SourceVsDom() {
  const screenRef = useRef<HTMLDivElement>(null);
  const [domText, setDomText] = useState('');

  // 画面の枠の中は、Reactではなく素のDOM操作で作る。Reactの外にあるそのDOMを見張って、文字に直して表示する。
  useEffect(() => {
    const screen = screenRef.current;
    if (screen === null) return;

    const observer = new MutationObserver(() => setDomText(describeDom(screen)));
    observer.observe(screen, { childList: true, subtree: true, characterData: true });
    loadPage(screen);

    return () => {
      observer.disconnect();
      screen.replaceChildren();
    };
  }, []);

  function withScreen(action: (screen: HTMLElement) => void) {
    if (screenRef.current !== null) action(screenRef.current);
  }

  return (
    <figure className="box live-example">
      <figcaption className="box-label">動かしてみよう</figcaption>

      <p className="pane-label">画面（文字をクリックすると、直接書き換えられます）</p>
      <div ref={screenRef} className="pane screen-pane" contentEditable suppressContentEditableWarning />
      <p>
        <button type="button" onClick={() => withScreen(renameBorrower)}>
          「佐藤」を「佐藤（総務）」に書き換える
        </button>{' '}
        <button type="button" onClick={() => withScreen(loadPage)}>
          リロードする
        </button>
      </p>

      <p className="pane-label">index.html（ファイルの中身）</p>
      <pre className="pane">
        <code>{SOURCE_HTML}</code>
      </pre>

      <p className="pane-label">検証ツールの Elements パネルに出る内容</p>
      <pre className="pane">
        <code>
          {markChangedLines(domText, SOURCE_HTML).map((line, index) => (
            // 行は並べ替えず、毎回上から順に描くだけなので、位置をkeyにする。
            <span key={index} className={line.changed ? 'dom-line changed' : 'dom-line'}>
              {line.text}
              {line.changed && <span className="changed-mark">← ファイルと違う</span>}
              {'\n'}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
