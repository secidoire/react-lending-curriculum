import { useEffect, useState } from 'react';
import type { TickerProps } from './logic';

// 依存配列に count を入れる。log. で始まる行は、右の履歴に記録するためのもので、動きには関係しない。
export function TickerDeps({ log, intervalMs }: TickerProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    log.recordRender(count);
  });

  useEffect(() => {
    log.startTimer();
    const timer = setInterval(() => {
      log.recordTick(count);
      setCount(count + 1);
    }, intervalMs);

    return () => {
      clearInterval(timer);
      log.stopTimer();
    };
    // count が変わるたびに、タイマーを止めて、新しい count を見るタイマーを作り直す。
  }, [count, intervalMs, log]);

  return <p className="ticker-count">count = {count}</p>;
}
