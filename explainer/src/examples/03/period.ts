// 'YYYY-MM-DD' の文字列を、'2026/10/12' のような表示にする。
export function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('ja-JP');
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// from から to までの日数。同じ日なら1日間。
export function daysOfPeriod(from: string, to: string): number {
  const fromTime = new Date(`${from}T00:00:00`).getTime();
  const toTime = new Date(`${to}T00:00:00`).getTime();
  return Math.round((toTime - fromTime) / MS_PER_DAY) + 1;
}
