# CLAUDE.md — React原理教材リポジトリ

## このリポジトリは何か
- 講師（先輩）とジュニアが一緒に学ぶ教材。題材は「社内の本・備品の貸出管理アプリ」1つ。
- このアプリを育てながら、Reactの原理・Hooks・データ設計・可読性・アーキテクチャを「困りごと（痛み）」をきっかけに学ぶ。
- 成果物は解説サイト `explainer/` だけ。勉強会で見せ、後で読み返す。**サイトだけ読めば全部わかる**ように作る。
- 別冊のハンズオン資料（お題・starter・solution）は作らない。困りごとの体験は、ページに埋め込んだ動く例で行う。
- 読者はジュニア（JS/TSの文法は書けるが、DOMとReactの内部は曖昧）。
- 教材本文・コメント・UI文言は日本語、識別子は英語で書く。

## 必ず守る設計原則
1. **痛み駆動**：新しい概念は、必ず「前回のコードでは困る状況」を体験させてから導入する。
2. **サイトだけで完結**：ページの外の資料・手元の環境・別のコマンドを前提にしない。困りごとはページ内の動く例で踏ませ、説明に必要なコードと前提はすべてページに書く。
3. **正解を先に見せない**：問いを先に出し、答え・解説の核心は必ず `<Reveal>` の中に入れる。
4. **動く例は小さく**：大きな視覚デモは `docs/demo-spec.md` の(a)〜(d)の4本だけ。各回の動く例は、その回の困りごとを1つ踏ませる最小のものにする。凝った演出はしない。
5. **用語の正確さ**：
   - 「仮想DOMがあるからReactは速い」と書かない。Reactの価値は宣言的UI（UI = f(state)）で、仮想DOMはその手段にすぎない。
   - 「Reactが変化を検知する」と書かない。ReactはsetStateで通知され、前回の値と比較するだけ。
   - 「再レンダリング」（コンポーネント関数の再実行）と「DOM更新（commit）」を区別する。
   - Fiberの内部フィールド名を暗記対象にしない。考え方のモデルとして扱い、実装の詳細であると明記する。
   - 「延滞」はstatusに持たず、dueDateと現在時刻から導出する。
   - 挙動に自信がないときは、`docs/references.md` にあるreact.devの該当ページを確認してから書く。
6. **レビューは問いで行う**：「ダメ」と言わず「予約キャンセルが来たらどこを直す？」と問う形で書く。
7. **各回の最後に次回の仕様変更を予告する**。次回の冒頭で、前回のコードがその変更に耐えるかを確認する。
8. **解説サイト自体がお手本**：`explainer/` のコードも下記の規約に従う。ジュニアが読む前提で書く。

## 技術スタック（正は `docs/tech-stack.md`。勝手に上げ下げしない）
- Node.js >= 22.12 / npm workspaces / Vite 8 + `@vitejs/plugin-react` 6 / React 19.3 / TypeScript ~6.0（strict）
- zod 4.6 / Vitest 5（純粋関数はnode環境、コンポーネントとDOMを触る例はBrowser Mode）
- ESLint（flat config）+ `eslint-plugin-react-hooks` recommended
- MDX（`@mdx-js/rollup`）+ Shiki（ビルド時のコードハイライト）
- React Compiler：`explainer/` は常にOFF（例やデモで再レンダリングを観察するため）。Compilerの扱いは第7回のページで説明する。
- 使わない：Next.js・サーバー・UIライブラリ・状態管理ライブラリ・ルーティングライブラリ・スライドツール。

## ディレクトリ（詳細は `docs/repository-structure.md`）
- `docs/` 仕様・カリキュラム・講師ガイド
- `explainer/src/sessions/` 各回のページ（MDX）
- `explainer/src/examples/<回>/` その回のページに埋め込む動く例と、そのテスト
- `explainer/src/demos/` 視覚デモ(a)〜(d) / `explainer/src/components/` 共通コンポーネント

## コーディング規約
- TypeScript strict。`any` と、型を偽る `as` は禁止。どうしても必要なら `unknown` で受けて zod で絞る。
- ドメインの型は `docs/domain-spec.md` に従う。Loanは判別可能なユニオン型にする（第4回以降。それより前の回は、その回に必要な最小の型でよい）。
- 派生できる値（フィルタ結果・件数・延滞など）はstateにしない。
- ドメイン関数は現在時刻 `now` を引数で受け取る。関数内で `new Date()` を直接呼ばない。
- 外部データ（フォーム・localStorage・偽API）は境界で zod により parse する。
- 関数コンポーネントのみ。1ファイル1コンポーネント、ファイル名はPascalCase.tsx。
- 例やデモのロジック（状態遷移・差分計算・ログ整形など）は純粋関数としてコンポーネントの外に出し、テストする。
- 例のコードのコメントには「なぜそうしたか」だけを書く。
- 悪い例は `explainer/src/examples/<回>/bad-examples/` に置き、冒頭に `// 教材用の悪い例：<理由>` を書く。良い例と混ぜない。
- ページに載せるコードは、`examples/` にある実際に動くコードから取る。ページ用に別のコードを書き起こさない。

## 作業の進め方
- **1回分ずつ作る**。指示されていない回のファイルを先に作らない。
- 着手前に `docs/curriculum.md` の該当節と `docs/domain-spec.md` を読み、作るファイルと完了条件を箇条書きで示してから実装する。
- 着手前に `docs/react-dev-map.md` も見て、その回に割り当てられた公式ドキュメントの項目を確かめる。作り終えたら、その表の「状態」を更新する。
- 各回で作るもの：`explainer/src/sessions/<回>.mdx`、`explainer/src/examples/<回>/`（動く例とテスト）。あわせて講師ガイドに追記する。
- 前回の例のコードが、今回の仕様変更で実際に困ることを確かめてから書く（次回の痛みは、できるだけテストで固定する）。
- 解説ページの書き方は `docs/explainer-spec.md`、デモと動く例は `docs/demo-spec.md` に従う。

## 各回の完了条件
- `npm run typecheck` / `npm run lint` / `npm run test` / `npm run test:browser` が全体で通る。
- 動く例にテストがある（良い例は仕様を満たし、悪い例は本文が言っているとおりに壊れる）。
- tests は実装の内部構造に依存させない（ロール・ラベル・テキストで要素を取る）。
- `npm run dev -w explainer` でその回のページが開き、読むモードと発表モードの両方で表示が崩れない。例とデモが動く。
- `npm run build -w explainer` が通る。
- 解説ページに「よくある誤解」と「次回の仕様変更予告」の節がある。答えが `<Reveal>` の外に漏れていない。
- ページの外の資料（別ファイル・コマンド・手元の環境）を読まないと理解できない箇所がない。
- react.devへのリンクが実在するページを指している。

## 確認コマンド
- `npm run dev -w explainer` / `npm run build -w explainer`
- `npm run test` / `npm run test:browser`

## やってはいけないこと
- 解説ページで答えを `<Reveal>` の外に書く。
- 「続きは手元で」「別のファイルを見て」のように、ページの外に体験や説明を出す。
- 「仮想DOMは速い」「useEffectはライフサイクルメソッドの代替」「Reactは変化を検知する」などの不正確な説明をする。
- 痛みを体験させる前に、Context・カスタムHook・Repository・useReducerを導入する。
- 第7回より前に、useMemo/useCallbackを「最適化の基本」として教える。
- 派生データをstateやuseEffectで同期するコードを、良い例として載せる。
- 解説サイトに `docs/explainer-spec.md` にない機能（検索・ダークモード切替・アニメーション・コメント機能など）を足す。
- CDN依存を入れる。サーバー・DB・認証を実装する。承認なしに依存パッケージを追加する。

## 参照ドキュメント（必要な回の作業時に読む）
- `docs/curriculum.md` / `docs/instructor-guide.md` / `docs/domain-spec.md`
- `docs/explainer-spec.md` / `docs/demo-spec.md` / `docs/advanced-handson-spec.md`
- `docs/tech-stack.md` / `docs/references.md` / `docs/react-dev-map.md`（満たすべきことの一覧、公式ドキュメントの各項目をどの回で扱うか、今後の進め方）
