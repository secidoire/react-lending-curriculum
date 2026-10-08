export type SandboxFile = {
  /** タブに出す名前（例：'rerender.ts'）。import の解決にも使うので、1つの例の中で重ならないようにする */
  name: string;
  code: string;
};

// ページに埋め込む「コードと実行結果」1組ぶんの定義。
export type SandboxSpec = {
  /** 先頭のファイルが、最初に開くタブになる */
  files: readonly SandboxFile[];
  /** 最初に実行するファイルの名前 */
  entry: string;
  /** entry が export している、例を組み立てる関数の名前。`(root: HTMLElement) => void` の形 */
  start: string;
};
