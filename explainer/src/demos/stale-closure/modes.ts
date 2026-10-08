import type { ComponentType } from 'react';
import type { Mode, TickerProps } from './logic';
import { TickerBug } from './TickerBug';
import tickerBugCode from './TickerBug.tsx?raw';
import { TickerDeps } from './TickerDeps';
import tickerDepsCode from './TickerDeps.tsx?raw';
import { TickerEffectEvent } from './TickerEffectEvent';
import tickerEffectEventCode from './TickerEffectEvent.tsx?raw';
import { TickerUpdater } from './TickerUpdater';
import tickerUpdaterCode from './TickerUpdater.tsx?raw';

// モードごとの、動かすコンポーネントと、画面に見せるそのコード（ファイルの中身そのもの）。
export const TICKERS: Record<Mode, { Ticker: ComponentType<TickerProps>; code: string }> = {
  bug: { Ticker: TickerBug, code: tickerBugCode },
  updater: { Ticker: TickerUpdater, code: tickerUpdaterCode },
  deps: { Ticker: TickerDeps, code: tickerDepsCode },
  effectEvent: { Ticker: TickerEffectEvent, code: tickerEffectEventCode },
};

export const MODES: readonly Mode[] = ['bug', 'updater', 'deps', 'effectEvent'];
