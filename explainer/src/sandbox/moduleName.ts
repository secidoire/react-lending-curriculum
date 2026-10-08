// './loans'・'../loans.ts'・'loans.ts' を、どれも同じ 'loans' として扱う。
// 例の中のファイルは、フォルダを無視して名前だけで探す。
export function moduleName(specifier: string): string {
  const fileName = specifier.split('/').at(-1) ?? specifier;
  return fileName.replace(/\.(ts|tsx|js|jsx)$/, '');
}
