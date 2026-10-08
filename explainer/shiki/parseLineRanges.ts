// コードブロックのメタ（例：```js {2-3,5}）から、ハイライトする行番号を取り出す。
export function parseLineRanges(meta: string): number[] {
  const match = /\{([\d,\s-]+)\}/.exec(meta);
  const body = match?.[1];
  if (body === undefined) return [];

  const lines = new Set<number>();
  for (const part of body.split(',')) {
    const [fromText = '', toText = fromText] = part.trim().split('-');
    const from = Number.parseInt(fromText, 10);
    const to = Number.parseInt(toText, 10);
    if (Number.isNaN(from) || Number.isNaN(to)) continue;
    for (let line = from; line <= to; line += 1) lines.add(line);
  }
  return [...lines].sort((a, b) => a - b);
}
