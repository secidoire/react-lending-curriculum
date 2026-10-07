# 技術スタック（2026年10月）

| パッケージ | 指定 |
|---|---|
| node | >=22.12（推奨24 LTS） |
| react / react-dom | ^19.3.0（2つは同じバージョンにそろえる） |
| vite / @vitejs/plugin-react | ^8 / ^6 |
| typescript | ~6.0 |
| zod | ^4.6 |
| vitest / @vitest/browser-playwright / vitest-browser-react / playwright | ^5 / 最新 |
| eslint / typescript-eslint / eslint-plugin-react-hooks | 最新 |
| babel-plugin-react-compiler / @rolldown/plugin-babel | 第7回で追加（`reactCompilerPreset`） |
| reveal.js | 6.0.2（vendorに同梱） |

## 判断1：React Compilerは第7回までOFF
Compiler由来のlintルールは初回から有効にします。 本体は第7回でONにして、DevToolsで差分を観察させます。第6回までは「レンダー中に計算する」だけを教え、useMemo/useCallbackは第7回でエスケープハッチとして紹介します。 

## 判断2：テスト
ドメインはnode環境で、時刻を注入してテストします。コンポーネントはBrowser Modeで、`render`はasync、検証は`expect.element(...)`を使います。社内PCにPlaywrightを入れにくい場合は、jsdom + @testing-library/reactでもかまいません。

## 判断3：React 19系の新API
| API | 扱い |
|---|---|
| useActionState / `<form action>` | 第5回でイベントハンドラ版と比較する |
| useEffectEvent | 0-4・第5回で紹介する |
| use / Suspenseによるデータ取得 | 範囲外（発展課題） |
| ViewTransition・Fragment refs・Server Components | 範囲外 |