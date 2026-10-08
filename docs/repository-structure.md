# リポジトリ構成

```
react-lending-curriculum/
├─ CLAUDE.md / .claude/rules/materials.md
├─ package.json            # workspaces、engines.node >= 22.12
├─ tsconfig.base.json      # strict, noUncheckedIndexedAccess
├─ eslint.config.js / vitest.config.ts（`test.projects` に node と browser の2プロジェクト）
├─ docs/
│  ├─ curriculum.md, instructor-guide.md, domain-spec.md
│  ├─ explainer-spec.md, demo-spec.md, advanced-handson-spec.md
│  └─ tech-stack.md, references.md, repository-structure.md
├─ explainer/              # 解説ページ（Vite + React + MDX）
│  ├─ index.html / vite.config.ts / package.json
│  └─ src/
│     ├─ main.tsx / App.tsx
│     ├─ router/            # useHashRoute.ts（自作ルーター）, pages.ts（import.meta.glob）
│     ├─ components/        # Reveal, Steps, Question, Misconception, Term, DocLink, Preview, Layout
│     ├─ sessions/          # 0-1.mdx 〜 08.mdx, A-1.mdx, A-2.mdx
│     ├─ demos/
│     │  ├─ full-vs-diff/   # (a) 素のJSのミニReactをrefの中で動かす
│     │  ├─ key-reorder/    # (b)
│     │  ├─ stale-closure/  # (c)
│     │  └─ update-timeline/# (d) 独立したrootで動かす
│     ├─ shared-mini-react/ # 0-3のsolutionと同じミニReact（デモ(a)用）
│     └─ styles/
└─ handson/
   ├─ part0/ 0-1-browser-dom/, 0-2-vanilla-list/, 0-3-mini-react/steps/01〜07/, 0-4-js-for-hooks/
   ├─ part1/ my-app/（ジュニアが累積的に育てるアプリ）, shared-test-utils/,
   │         sessions/01-item-list/ … 08-refactor/（README, starter, solution, tests, bad-examples）
   └─ advanced/ mini-react-plus/steps/01〜08/（README, starter, solution, tests）
```

## 運用ルール
- ジュニアは `handson/part1/my-app/` に累積的に書いていく。前回のコードが仕様変更に耐えるかを確かめることが、この教材の核になる。
- `sessions/NN/tests/` は my-app と solution の両方に対して実行できる受け入れテストにする。
- テストは既定で `solution/` を対象にする（`npm run test` / `npm run test:browser`）。`npm run test:starter -- <お題のパス>` を使うと、同じテストを `starter/`（第0部でジュニアが書く場所）に対して実行する。切り替えは Vite の mode（`import.meta.env.MODE === 'starter'`）で行う。
- Reactを使わずDOMを触るコードのテストは `*.browser.test.ts` とし、Browser Modeで実行する。
- `explainer/src/shared-mini-react/` は `handson/part0/0-3-mini-react/steps/07/solution` と同じ内容に保つ。差分が出たら handson 側を正とする（同期を確かめるテストを置く）。

## 第1部 第7回の到達形（handson/part1/my-app/src/）
```
src/
├─ app/        App.tsx, providers（repository・clock・currentUserのContext）
├─ features/
│  ├─ items/   components/ hooks/ index.ts
│  ├─ loans/   components/ hooks/ domain/（transitions, overdue, overlap, policy）
│  │           repository/（LoanRepository, fake, http（スタブ））index.ts
│  └─ users/
└─ shared/     汎用UI, zodスキーマ, clock.ts
```
