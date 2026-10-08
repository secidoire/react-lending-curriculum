import { useSyncExternalStore } from 'react';
import { parseHash, type Route } from './parseHash';

// 外部の状態（URL）をReactに取り込む例。
// URLはReactのstateではないので、Reactは変わったことを知らない。
// hashchange イベントで「変わった」と知らせてもらい、そのとき今の値を読み直す。
function subscribe(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

function getSnapshot(): string {
  return window.location.hash;
}

export function useHashRoute(): Route {
  const hash = useSyncExternalStore(subscribe, getSnapshot);
  return parseHash(hash);
}
