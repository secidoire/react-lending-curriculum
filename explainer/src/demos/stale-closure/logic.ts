// デモ(c)の記録。観察しているコンポーネントが「いつレンダーされ、タイマーがいつ作られ、
// コールバックが count をいくつだと見ていたか」を積んでいく。

export type Mode = 'bug' | 'updater' | 'deps' | 'effectEvent';

export const MODE_LABELS: Record<Mode, string> = {
  bug: 'バグ版',
  updater: '関数型更新',
  deps: '依存配列にcount',
  effectEvent: 'useEffectEvent版',
};

export type TimerEntry = {
  /** このタイマーを作ったエフェクトが動いたレンダーの番号（1始まり） */
  createdAtRender: number;
  stopped: boolean;
  tickCount: number;
};

export type Log = {
  /** レンダーごとの count。添字+1 がレンダーの番号 */
  renders: readonly number[];
  timers: readonly TimerEntry[];
  /** いちばん最近のコールバックが見ていた count。count を読まない書き方のときは null。まだ呼ばれていなければ undefined */
  lastSeenCount: number | null | undefined;
};

export const emptyLog: Log = { renders: [], timers: [], lastSeenCount: undefined };

// 同じ count が続けて記録されたときは、1回と数える。
// （開発中のStrict Modeは、確認のためにエフェクトを2回動かす。それを別のレンダーと数えないため）
export function recordRender(log: Log, count: number): Log {
  if (log.renders.at(-1) === count) return log;
  return { ...log, renders: [...log.renders, count] };
}

export function startTimer(log: Log): Log {
  const createdAtRender = log.renders.length;
  const last = log.timers.at(-1);
  // 同じレンダーで「作る → 止める → 作る」と続いたとき（Strict Modeの確認）は、1つのタイマーと数える。
  if (last !== undefined && last.stopped && last.tickCount === 0 && last.createdAtRender === createdAtRender) {
    return { ...log, timers: [...log.timers.slice(0, -1), { ...last, stopped: false }] };
  }
  return { ...log, timers: [...log.timers, { createdAtRender, stopped: false, tickCount: 0 }] };
}

export function stopTimer(log: Log): Log {
  return { ...log, timers: log.timers.map((timer) => (timer.stopped ? timer : { ...timer, stopped: true })) };
}

export function recordTick(log: Log, seenCount: number | null): Log {
  return {
    ...log,
    lastSeenCount: seenCount,
    timers: log.timers.map((timer) => (timer.stopped ? timer : { ...timer, tickCount: timer.tickCount + 1 })),
  };
}

// 動いているタイマーを作ったレンダーの番号。なければ null。
export function runningTimerRender(log: Log): number | null {
  return log.timers.find((timer) => !timer.stopped)?.createdAtRender ?? null;
}

export function describeTimer(timer: TimerEntry, index: number): string {
  const state = timer.stopped ? '× 停止' : '動作中';
  return `タイマー${index + 1}：レンダー#${timer.createdAtRender}で開始・${state}（${timer.tickCount}回呼ばれた）`;
}

export function describeLastTick(log: Log): string {
  if (log.lastSeenCount === undefined) return 'コールバックは、まだ呼ばれていません';
  if (log.lastSeenCount === null) return 'いちばん最近の呼び出し：count を読まずに、setCount((c) => c + 1)';
  const seen = log.lastSeenCount;
  return `いちばん最近の呼び出し：count は ${seen} に見えている → setCount(${seen} + 1)`;
}

// 一覧が伸び続けないよう、後ろの limit 件だけを、もとの位置（添字）つきで取り出す。
export function lastItems<T>(items: readonly T[], limit: number): { item: T; index: number }[] {
  const start = Math.max(0, items.length - limit);
  return items.slice(start).map((item, offset) => ({ item, index: start + offset }));
}

// 記録を、Reactの外に置いておくための入れ物。
export type LogStore = {
  recordRender: (count: number) => void;
  startTimer: () => void;
  stopTimer: () => void;
  recordTick: (seenCount: number | null) => void;
  subscribe: (onChange: () => void) => () => void;
  getSnapshot: () => Log;
};

export function createLogStore(): LogStore {
  let log = emptyLog;
  const listeners = new Set<() => void>();

  function update(next: Log) {
    if (next === log) return;
    log = next;
    for (const listener of listeners) listener();
  }

  return {
    recordRender: (count) => update(recordRender(log, count)),
    startTimer: () => update(startTimer(log)),
    stopTimer: () => update(stopTimer(log)),
    recordTick: (seenCount) => update(recordTick(log, seenCount)),
    subscribe(onChange) {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    getSnapshot: () => log,
  };
}

export type TickerProps = {
  log: LogStore;
  intervalMs: number;
};
