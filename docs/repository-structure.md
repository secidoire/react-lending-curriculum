# リポジトリ構成

```
react-lending-curriculum/
├─ CLAUDE.md / .claude/rules/materials.md
├─ package.json            # workspaces、engines.node >= 22.12
├─ tsconfig.base.json      # strict, noUncheckedIndexedAccess
├─ eslint.config.js / vitest.config.ts（`test.projects` に node と browser の2プロジェクト）
├─ docs/  curriculum.md, instructor-guide.md, domain-spec.md, demo-spec.md,
│         slide-spec.md, tech-stack.md, references.md, sessions/0-1.md〜08.md
├─ slides/ index.html, vendor/reveal/（6.0.2のdist）, assets/theme.css, sessions/*.html
├─ demos/  a-full-vs-diff/（素のJS）, b-key-reorder/, c-stale-closure/（React→IIFE）, dist/
└─ handson/
   ├─ part0/ 0-1-browser-dom/, 0-2-vanilla-list/, 0-3-mini-react/steps/01〜07/, 0-4-js-for-hooks/
   └─ part1/ my-app/（ジュニアが累積的に育てるアプリ）, shared-test-utils/,
             sessions/01-item-list/ … 08-refactor/（README, starter, solution, tests, bad-examples）
```

## 運用ルール
- ジュニアは `part1/my-app/` に累積的に書いていく。前回のコードが仕様変更に耐えるかを確かめることが、この教材の核になる。
- `sessions/NN/tests/` は my-app と solution の両方に対して実行できる受け入れテストにする。

## 第7回の到達形（src/）
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