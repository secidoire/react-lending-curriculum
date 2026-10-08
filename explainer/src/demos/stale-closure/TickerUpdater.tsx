import { useEffect, useState } from 'react';
import type { TickerProps } from './logic';

// 関数型更新。log. で始まる行は、右の履歴に記録するためのもので、動きには関係しない。
export function TickerUpdater({ log, intervalMs }: TickerProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    log.recordRender(count);
  });

  useEffect(() => {
    log.startTimer();
    const timer = setInterval(() => {
      log.recordTick(null);
      // count を読まない。「いまの値に1を足して」という計算のしかたを渡す。
      setCount((current) => current + 1);
    }, intervalMs);

    return () => {
      clearInterval(timer);
      log.stopTimer();
    };
  }, [intervalMs, log]);

  return <p className="ticker-count">count = {count}</p>;
}
