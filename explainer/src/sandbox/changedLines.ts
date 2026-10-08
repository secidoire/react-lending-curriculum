// code の行のうち、previous のどの行とも一致しない行の番号（1始まり）を返す。
// 字下げの違いは無視する。空行は、変わった行として数えない。
export function changedLineNumbers(code: string, previous: string): number[] {
  const previousLines = new Set(previous.split('\n').map((line) => line.trim()));
  return code.split('\n').flatMap((line, index) => {
    const text = line.trim();
    return text !== '' && !previousLines.has(text) ? [index + 1] : [];
  });
}
