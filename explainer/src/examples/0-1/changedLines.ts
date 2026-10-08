export type MarkedLine = { text: string; changed: boolean };

// text の各行に、「reference のどの行とも一致しない」という印を付ける。字下げの違いは無視する。
export function markChangedLines(text: string, reference: string): MarkedLine[] {
  const referenceLines = new Set(reference.split('\n').map((line) => line.trim()));
  return text.split('\n').map((line) => ({ text: line, changed: !referenceLines.has(line.trim()) }));
}
