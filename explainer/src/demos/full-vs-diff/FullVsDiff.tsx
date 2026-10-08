import { useEffect, useState } from 'react';
import { addLoan, initialState, toggleFirstStatus } from './logic';
import { Pane } from './Pane';

const AUTO_TOGGLE_MS = 1500;

// デモ(a)：同じ状態を、「全部作り直す」と「違うところだけ直す」の2通りで描いて並べる。
export function FullVsDiff() {
  const [state, setState] = useState(initialState);
  const [auto, setAuto] = useState(false);
  // 「リセット」のたびに増やす。ペインの key に使い、変更の数ごと作り直す。
  const [resetCount, setResetCount] = useState(0);

  // 「自動で切り替える」の間、一定の間隔で1行目の状態を切り替える（タイマーというReactの外のシステムとの同期）。
  // ボタンを押さずに画面が変わるので、入力欄にフォーカスを置いたまま観察できる。
  useEffect(() => {
    if (!auto) return;

    const timer = setInterval(() => setState(toggleFirstStatus), AUTO_TOGGLE_MS);
    return () => clearInterval(timer);
  }, [auto]);

  function reset() {
    setState(initialState);
    setAuto(false);
    setResetCount(resetCount + 1);
  }

  return (
    <figure className="box demo">
      <figcaption className="box-label">デモ：全部作り直す／違うところだけ直す</figcaption>
      <p>
        <button type="button" onClick={() => setState(addLoan)}>
          1件追加
        </button>{' '}
        <button type="button" onClick={() => setState(toggleFirstStatus)}>
          1行目の状態を切り替える
        </button>{' '}
        <button type="button" aria-pressed={auto} onClick={() => setAuto(!auto)}>
          {auto ? '自動の切り替えを止める' : '自動で切り替える（1.5秒ごと）'}
        </button>{' '}
        <button type="button" onClick={reset}>
          リセット
        </button>
      </p>
      <div className="demo-panes">
        <Pane key={`full:${resetCount}`} title="全部作り直す" mode="full" state={state} />
        <Pane key={`diff:${resetCount}`} title="違うところだけ直す" mode="diff" state={state} />
      </div>
      <p className="demo-note">どちらかのメモ欄に文字を打ちながら、「自動で切り替える」を押してみてください。</p>
    </figure>
  );
}
