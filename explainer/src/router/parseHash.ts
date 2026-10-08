export type Route = {
  /** 回のID（例：'0-3'、'A-1'）。ページ一覧のときは null */
  sessionId: string | null;
  /** 発表モードかどうか（URLの末尾が ?present） */
  present: boolean;
};

// '#/0-3?present' → { sessionId: '0-3', present: true }
export function parseHash(hash: string): Route {
  const [path = '', query = ''] = hash.replace(/^#\/?/, '').split('?');
  return {
    sessionId: path === '' ? null : path,
    present: new URLSearchParams(query).has('present'),
  };
}

export function formatHash(route: Route): string {
  return `#/${route.sessionId ?? ''}${route.present ? '?present' : ''}`;
}
