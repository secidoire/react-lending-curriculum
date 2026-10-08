// '../sessions/0-3.mdx' → '0-3'
export function sessionIdFromPath(path: string): string {
  const fileName = path.split('/').at(-1) ?? path;
  return fileName.replace(/\.mdx$/, '');
}

// 並び順は 0-1〜0-4（第0部）→ 01〜08（第1部）→ A-1, A-2（発展編）。
function partOf(sessionId: string): number {
  if (/^0-\d+$/.test(sessionId)) return 0;
  if (/^\d{2}$/.test(sessionId)) return 1;
  return 2;
}

export function compareSessionIds(a: string, b: string): number {
  return partOf(a) - partOf(b) || a.localeCompare(b, 'en', { numeric: true });
}
