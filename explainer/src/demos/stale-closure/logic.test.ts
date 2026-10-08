import { describe, expect, it, vi } from 'vitest';
import {
  createLogStore,
  describeLastTick,
  describeTimer,
  emptyLog,
  lastItems,
  recordRender,
  recordTick,
  runningTimerRender,
  startTimer,
  stopTimer,
} from './logic';

describe('レンダーの記録', () => {
  it('count を順に積む。同じ count が続いたら1回と数える', () => {
    const log = [0, 0, 1, 1, 2].reduce(recordRender, emptyLog);

    expect(log.renders).toEqual([0, 1, 2]);
  });
});

describe('タイマーの記録', () => {
  it('作ったときのレンダーの番号を覚え、呼ばれた回数を数える', () => {
    let log = startTimer(recordRender(emptyLog, 0));
    log = recordTick(recordTick(log, 0), 0);

    expect(log.timers).toEqual([{ createdAtRender: 1, stopped: false, tickCount: 2 }]);
    expect(runningTimerRender(log)).toBe(1);
    expect(describeTimer(log.timers[0] ?? { createdAtRender: 0, stopped: true, tickCount: 0 }, 0)).toBe(
      'タイマー1：レンダー#1で開始・動作中（2回呼ばれた）',
    );
  });

  it('止めてから次のレンダーで作り直すと、別のタイマーとして並ぶ', () => {
    let log = startTimer(recordRender(emptyLog, 0));
    log = stopTimer(recordTick(log, 0));
    log = startTimer(recordRender(log, 1));

    expect(log.timers.map((timer) => [timer.createdAtRender, timer.stopped])).toEqual([
      [1, true],
      [2, false],
    ]);
    expect(runningTimerRender(log)).toBe(2);
  });

  it('同じレンダーで「作る → 止める → 作る」と続いたら、1つのタイマーと数える', () => {
    const log = startTimer(stopTimer(startTimer(recordRender(emptyLog, 0))));

    expect(log.timers).toEqual([{ createdAtRender: 1, stopped: false, tickCount: 0 }]);
  });
});

describe('describeLastTick', () => {
  it('コールバックが見ていた count を文にする', () => {
    const started = startTimer(recordRender(emptyLog, 0));

    expect(describeLastTick(started)).toBe('コールバックは、まだ呼ばれていません');
    expect(describeLastTick(recordTick(started, 0))).toBe(
      'いちばん最近の呼び出し：count は 0 に見えている → setCount(0 + 1)',
    );
    expect(describeLastTick(recordTick(started, null))).toBe(
      'いちばん最近の呼び出し：count を読まずに、setCount((c) => c + 1)',
    );
  });
});

describe('lastItems', () => {
  it('後ろの数件を、もとの位置つきで返す', () => {
    expect(lastItems(['a', 'b', 'c', 'd'], 2)).toEqual([
      { item: 'c', index: 2 },
      { item: 'd', index: 3 },
    ]);
    expect(lastItems(['a'], 2)).toEqual([{ item: 'a', index: 0 }]);
  });
});

describe('createLogStore', () => {
  it('変わったときだけ購読者に知らせる', () => {
    const store = createLogStore();
    const listener = vi.fn();
    store.subscribe(listener);

    store.recordRender(0);
    store.recordRender(0);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot().renders).toEqual([0]);
  });
});
