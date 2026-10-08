import { useEffect, useState } from 'react';
import type { TickerProps } from './logic';

// バグ版。log. で始まる行は、右の履歴に記録するためのもので、動きには関係しない。
export function TickerBug({ log, intervalMs }: TickerProps) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 教材用の例なので、lintの指摘をここだけ止めている
  }, [intervalMs, log]);

  return <p className="ticker-count">count = {count}</p>;
}
