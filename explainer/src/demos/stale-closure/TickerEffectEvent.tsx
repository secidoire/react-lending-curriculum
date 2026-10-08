import { useEffect, useEffectEvent, useState } from 'react';
import type { TickerProps } from './logic';

// useEffectEvent版。log. で始まる行は、右の履歴に記録するためのもので、動きには関係しない。
export function TickerEffectEvent({ log, intervalMs }: TickerProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    log.recordRender(count);
  });

  // この関数の中では、呼ばれた時点でいちばん新しい count が読める。
  const onTick = useEffectEvent(() => {
    log.recordTick(count);
    setCount(count + 1);
  });

  useEffect(() => {
    log.startTimer();
    const timer = setInterval(() => onTick(), intervalMs);

    return () => {
      clearInterval(timer);
      log.stopTimer();
    };
  }, [intervalMs, log]);

  return <p className="ticker-count">count = {count}</p>;
}
