import { useSyncExternalStore } from 'react';
import { describeLastTick, describeTimer, lastItems, runningTimerRender, type LogStore } from './logic';

// 画面に出す件数。これより古いものは省く。
const SHOWN_RENDERS = 5;
const SHOWN_TIMERS = 3;

type Props = { log: LogStore };

// 記録（Reactの外にある）を読んで、レンダーごとのカードとタイマーの一覧を出す。
export function RenderHistory({ log }: Props) {
  const snapshot = useSyncExternalStore(log.subscribe, log.getSnapshot);
  const timerRender = runningTimerRender(snapshot);

  return (
    <section className="demo-pane" aria-label="レンダー履歴">
      <h3>レンダー履歴</h3>
      {snapshot.renders.length > SHOWN_RENDERS && <p className="demo-note">（古いレンダーは省略しています）</p>}
      <ol className="render-cards">
        {lastItems(snapshot.renders, SHOWN_RENDERS).map(({ item: count, index }) => (
          <li key={index} className={timerRender === index + 1 ? 'render-card referenced' : 'render-card'}>
            <strong>#{index + 1}</strong> count = {count}
            {timerRender === index + 1 && <span className="render-card-mark">◀ 動作中のタイマーは、ここで作られた</span>}
          </li>
        ))}
      </ol>
      <p className="demo-status">{describeLastTick(snapshot)}</p>
      <ul className="timer-list">
        {lastItems(snapshot.timers, SHOWN_TIMERS).map(({ item: timer, index }) => (
          <li key={index}>{describeTimer(timer, index)}</li>
        ))}
      </ul>
    </section>
  );
}
