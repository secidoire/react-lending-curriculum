# CLAUDE.md — React原理教材リポジトリ

## このリポジトリは何か
- 講師（先輩）とジュニアが一緒に学ぶ教材一式。題材は「社内の本・備品の貸出管理アプリ」1つ。
- このアプリを育てながら、Reactの原理・Hooks・データ設計・可読性・アーキテクチャを「困りごと（痛み）」をきっかけに学ぶ。
- 読者はジュニア（JS/TSの文法は書けるが、DOMとReactの内部は曖昧）。
- 教材本文・コメント・スライド・UI文言は日本語、識別子は英語で書く。

## 必ず守る設計原則
1. **痛み駆動**：新しい概念は、必ず「前回のコードでは困る状況」を体験させてから導入する。
2. **正解を先に見せない**：お題（`handson/**/README.md`）に答えを書かない。模範解答は `solution/` にだけ置く。
   ヒントは段階的に出し（Hint1→3）、答えに近いものほど `<details>` で折りたたむ。
3. **デモは最小限**：視覚デモは `docs/demo-spec.md` の(a)(b)(c)の3本だけ。凝った演出はしない。
4. **用語の正確さ**：
   - 「仮想DOMがあるからReactは速い」と書かない。Reactの価値は宣言的UI（UI = f(state)）で、仮想DOMはその手段にすぎない。
   - 「再レンダリング」（コンポーネント関数の再実行）と「DOM更新（commit）」を区別する。
   - 「延滞」はstatusに持たず、dueDateと現在時刻から導出する。
   - 挙動に自信がないときは、`docs/references.md` にあるreact.devの該当ページを確認してから書く。
5. **レビューは問いで行う**：「ダメ」と言わず「予約キャンセルが来たらどこを直す？」と問う形で書く。
6. **各回の最後に次回の仕様変更を予告する**。次回の冒頭で、前回のコードがその変更に耐えるかを確認する。

## 技術スタック（正は `docs/tech-stack.md`。勝手に上げ下げしない）
- Node.js >= 22.12 / npm workspaces / Vite 8 + `@vitejs/plugin-react` 6 / React 19.3 / TypeScript ~6.0（strict）
- zod 4.6 / Vitest 5（ドメインはnode環境、コンポーネントはBrowser Mode + vitest-browser-react）
- ESLint（flat config）+ `eslint-plugin-react-hooks` recommended
- React Compiler：第1〜6回は**OFF**、第7回でONにする。
- スライド：reveal.js 6.0.2 を `slides/vendor/reveal/` に同梱する（CDNは使わない）。
- Next.js・サーバー・UIライブラリ・状態管理ライブラリ・React Routerは使わない。

## ディレクトリ（詳細は `docs/repository-structure.md`）
- `docs/` 仕様・カリキュラム・講師ガイド・読み物 / `slides/` HTMLスライド / `demos/` デモ3本
- `handson/part0/` 素のJSとミニReact / `handson/part1/` Reactアプリ（各回に starter / solution / tests）

## コーディング規約
- TypeScript strict。`any` と、型を偽る `as` は禁止。どうしても必要なら `unknown` で受けて zod で絞る。
- ドメインの型は `docs/domain-spec.md` に従う。Loanは判別可能なユニオン型にする。
- 派生できる値（フィルタ結果・件数・延滞など）はstateにしない。 
- ドメイン関数は現在時刻 `now` を引数で受け取る。関数内で `new Date()` を直接呼ばない。
- 外部データ（フォーム・localStorage・偽API）は境界で zod により parse する。
- 関数コンポーネントのみ。1ファイル1コンポーネント、ファイル名はPascalCase.tsx。
- 模範解答のコメントには「なぜそうしたか」だけを書く。
- 悪い例は `bad-examples/` に置き、冒頭に `// 教材用の悪い例：<理由>` を書く。solutionには混ぜない。

## 作業の進め方
- **1回分ずつ作る**。指示されていない回のファイルを先に作らない。
- 着手前に `docs/curriculum.md` の該当節と `docs/domain-spec.md` を読み、作るファイルと完了条件を箇条書きで示してから実装する。
- 各回で作るもの：`docs/sessions/<回>.md`、`slides/sessions/<回>.html`、お題README、`starter/`、`solution/`、`tests/`。あわせて講師ガイドに追記する。
- 第1部の `starter/` は前回の solution のコピーとする（ジュニアのコードが壊れたときの合流地点）。

## 各回の完了条件
- `npm run typecheck` / `npm run lint` / `npm run test` が全体で通る。
- `solution/` では tests が全件パスし、`starter/` ではその回の機能のテストが失敗する（お題として成立している）。
- tests は実装の内部構造に依存させない（ロール・ラベル・テキストで要素を取る）。
- スライドを `file://` で開いて、コードハイライト・スピーカーノート（Sキー）・デモのiframeが動く。
- 読み物に「よくある誤解」と「次回の仕様変更予告」の節がある。react.devへのリンクが実在するページを指している。

## 確認コマンド
- `npm run dev -w handson/part1/sessions/03/solution` / `npm run test` / `npm run test:browser`
- `npm run build:demos`（デモ(b)(c)をIIFEにビルドし、`demos/dist/` をコミットする）

## やってはいけないこと
- お題に答えを書く。starterに完成コードを入れる。
- 「仮想DOMは速い」「useEffectはライフサイクルメソッドの代替」などの不正確な説明をする。
- 痛みを体験させる前に、Context・カスタムHook・Repository・useReducerを導入する。
- 第7回より前にReact Compilerを有効化したり、useMemo/useCallbackを「最適化の基本」として教えたりする。
- 派生データをstateやuseEffectで同期する模範解答を書く。 
- CDN依存を入れる。サーバー・DB・認証を実装する。承認なしに依存パッケージを追加する。

## 参照ドキュメント（必要な回の作業時に読む）
- `docs/curriculum.md` / `docs/instructor-guide.md` / `docs/domain-spec.md`
- `docs/demo-spec.md` / `docs/slide-spec.md` / `docs/tech-stack.md` / `docs/references.md`