# リポジトリ構成

成果物は解説サイト（`explainer/`）だけ。別冊のハンズオン資料は作らない。

```
react-lending-curriculum/
├─ CLAUDE.md / .claude/rules/materials.md
├─ .github/workflows/pages.yml   # main へのpushで解説サイトを GitHub Pages に公開する
├─ package.json            # workspaces（explainer）、engines.node >= 22.12
├─ tsconfig.base.json      # strict, noUncheckedIndexedAccess
├─ eslint.config.js / vitest.config.ts（`test.projects` に node と browser の2プロジェクト）
├─ docs/
│  ├─ curriculum.md, instructor-guide.md, domain-spec.md
│  ├─ explainer-spec.md, demo-spec.md, advanced-handson-spec.md
│  └─ tech-stack.md, references.md, repository-structure.md
└─ explainer/              # 解説サイト（Vite + React + MDX）
   ├─ index.html / vite.config.ts / mdx.config.ts / package.json
   ├─ shiki/               # コードブロックの行ハイライト（ビルド時）
   └─ src/
      ├─ main.tsx / App.tsx
      ├─ router/           # useHashRoute.ts（自作ルーター）, parseHash.ts, pages.ts（import.meta.glob）
      ├─ components/       # Reveal, Steps, Question, Misconception, Term, DocLink, Preview, LiveExample, Layout
      ├─ sessions/         # 0-1.mdx 〜 08.mdx, A-1.mdx, A-2.mdx
      ├─ examples/         # 各回のページに埋め込む動く例
      │  ├─ find.ts        # 例で共通に使う小さな道具
      │  └─ <回>/          # その回の例・純粋関数・テスト。悪い例は bad-examples/ に置く
      ├─ demos/            # 視覚デモ（4本だけ）
      │  ├─ full-vs-diff/  # (a)
      │  ├─ key-reorder/   # (b)
      │  ├─ stale-closure/ # (c)
      │  └─ update-timeline/ # (d) 独立したrootで動かす
      ├─ shared-mini-react/ # 0-3で作るミニReact（デモ(a)でも使う）
      └─ styles/
```

## 運用ルール
- 貸出管理アプリのコードは、回ごとに `explainer/src/examples/<回>/` に置く。前回の例が今回の仕様変更に耐えるかを確かめることが、この教材の核になる。
- 次の回の例は、前の回の例をコピーして出発点にする。回をまたいで import しない（前の回のページが、後の回の変更で壊れないようにするため）。
- テストは拡張子で実行環境を分ける。
  - `*.test.ts`：純粋関数（node）
  - `*.test.tsx`：Reactコンポーネント（Browser Mode）
  - `*.browser.test.ts`：Reactを使わずDOMを触るコード（Browser Mode）
- ページに載せるコードは、`examples/` の実際に動くコードから取る。

## 第1部 第7回の到達形（`explainer/src/examples/07/` の中）
```
├─ app/        App.tsx, providers（repository・clock・currentUserのContext）
├─ features/
│  ├─ items/   components/ hooks/ index.ts
│  ├─ loans/   components/ hooks/ domain/（transitions, overdue, overlap, policy）
│  │           repository/（LoanRepository, fake, http（スタブ））index.ts
│  └─ users/
└─ shared/     汎用UI, zodスキーマ, clock.ts
```
