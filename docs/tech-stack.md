# 技術スタック（2026年10月）

## 共通
| パッケージ | 指定 |
|---|---|
| node | >=22.12（推奨24 LTS） |
| react / react-dom | ^19.3.0（2つは同じバージョンにそろえる） |
| vite / @vitejs/plugin-react | ^8 / ^6 |
| typescript | ~6.0 |
| zod | ^4.6 |
| vitest / @vitest/browser-playwright / vitest-browser-react / playwright | ^5 / 最新 |
| eslint / typescript-eslint / eslint-plugin-react-hooks | 最新 |

## explainer のみ
| パッケージ | 指定 |
|---|---|
| @mdx-js/rollup | 導入時の最新安定版で固定する |
| @shikijs/rehype | 導入時の最新安定版で固定する |
| @types/mdx | 導入時の最新安定版で固定する |

## 第7回で追加（React Compilerをページ内の例で見せる場合。導入のしかたは第7回の着手時に決める）
| パッケージ | 指定 |
|---|---|
| babel-plugin-react-compiler / @rolldown/plugin-babel | `reactCompilerPreset` を使う（react.devの手順に従う） |

## 判断1：React Compiler
- `explainer`：常にOFF。例やデモで再レンダリングの回数や参照の変化を見せるため。
- 第6回までは「レンダー中に計算する」だけを教え、useMemo/useCallbackは第7回でエスケープハッチとして紹介する。CompilerをONにしたときの違いをどう見せるかは、第7回の着手時に決める。
- Compiler由来のlintルールは、どちらも初回から有効にする。

## 判断2：テスト
- ドメインと、例・デモのロジックはnode環境で、時刻を注入してテストする。
- コンポーネントはBrowser Modeで、`render`はasync、検証は`expect.element(...)`を使う。
- 社内PCにPlaywrightを入れにくい場合は、jsdom + @testing-library/reactでもかまわない。

## 判断3：React 19系の新API
| API | 扱い |
|---|---|
| useActionState / `<form action>` | 第5回でイベントハンドラ版と比較する |
| useEffectEvent | 0-4・第5回で紹介する。デモ(c)のモードの1つ |
| useSyncExternalStore | explainerの自作ルーターで使う。発展編で読む |
| use / Suspenseによるデータ取得 | 範囲外（発展課題） |
| ViewTransition・Fragment refs・Server Components | 範囲外 |

## バージョンの固定
- 第0回（土台づくり）で全パッケージのバージョンを確定し、lockfileをコミットする。教材の作成途中にメジャー更新を取り込まない。
