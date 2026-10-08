export type SandboxFile = {
  /** タブに出す名前（例：'rerender.ts'）。import の解決にも使うので、1つの例の中で重ならないようにする */
  name: string;
  code: string;
  /** 前の段階のコード。渡すと、そこから変わった行に印を付ける */
  changedFrom?: string;
};

// ページに埋め込む「コードと実行結果」1組ぶんの定義。
export type SandboxSpec = {
  /** 先頭のファイルが、最初に開くタブになる */
  files: readonly SandboxFile[];
  /** 最初に実行するファイルの名前 */
  entry: string;
  /**
   * 素のJavaScriptの例：entry が export している、例を組み立てる関数の名前。
   * `(root: HTMLElement) => void` の形。後片づけが要るときは、片づける関数を返す。
   */
  start?: string;
  /** Reactの例：entry が export している、画面に出すコンポーネントの名前。枠がこれを描画する */
  component?: string;
  /** JSXを、どの関数の呼び出しに変換するか（例：'h'）。省くと、Reactの要素を作る呼び出しに変換する */
  jsxPragma?: string;
};
