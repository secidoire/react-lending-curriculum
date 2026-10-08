import { useState } from 'react';
import { createLogStore, MODE_LABELS, type Mode } from './logic';
import { MODES, TICKERS } from './modes';
import { RenderHistory } from './RenderHistory';

type Props = {
  /** タイマーの間隔。テストでは短くする */
  intervalMs?: number;
};

// デモ(c)：1秒ごとに count を1増やすつもりのコードを、4通りの書き方で動かす。
export function StaleClosure({ intervalMs = 1000 }: Props) {
  // モードを切り替えるたび（と「最初から」のたび）に、新しい記録と、新しいカウンタで始める。
  const [session, setSession] = useState(() => ({ mode: MODES[0] ?? 'bug', id: 0, log: createLogStore() }));
  const { Ticker, code } = TICKERS[session.mode];

  function start(mode: Mode) {
    setSession({ mode, id: session.id + 1, log: createLogStore() });
  }

  return (
    <figure className="box demo">
      <figcaption className="box-label">デモ：1秒ごとに count を増やす、4通りの書き方</figcaption>
      <p>
        {MODES.map((mode) => (
          <span key={mode}>
            <button type="button" aria-pressed={mode === session.mode} onClick={() => start(mode)}>
              {MODE_LABELS[mode]}
            </button>{' '}
          </span>
        ))}
        <button type="button" onClick={() => start(session.mode)}>
          最初から
        </button>
      </p>
      <div className="demo-panes">
        <section className="demo-pane" aria-label="カウンタとコード">
          <h3>{MODE_LABELS[session.mode]}</h3>
          <Ticker key={session.id} log={session.log} intervalMs={intervalMs} />
          <pre className="demo-code">
            <code>{code}</code>
          </pre>
        </section>
        <RenderHistory log={session.log} />
      </div>
      <p className="demo-note">右の「#1」「#2」は、コンポーネントの関数が呼ばれた回（レンダー）ごとの count です。</p>
    </figure>
  );
}
