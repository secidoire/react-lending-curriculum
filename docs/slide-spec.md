# スライド仕様

## 選定：reveal.js 6.0.2を同梱（推奨）
| 選択肢 | 開くだけで動く | ハイライト | デモ埋め込み | ノート | 評価 |
|---|---|---|---|---|---|
| 素のHTML自作 | ◎ | 要自作 | ◎ | 要自作 | ページ送り・ノート・PDF化の自作が本筋から外れる |
| **reveal.js 6** | ◎ UMDビルドはファイルシステムから動く | ◎ 段階的な行ハイライト  | ◎ `iframe data-src` | ◎ Sキー | **採用** |
| Marp | △ 変換が必要 | ○ | △ | ○ | デモ埋め込みと相性が悪い |
| Slidev | × 開発サーバーが前提 | ◎ | ◎ | ◎ | 要件を満たさない |

## reveal.js 6の注意点
- プラグインのパスは`dist/plugin/<name>.js`（例：`dist/plugin/notes.js`、`dist/plugin/highlight/monokai.css`）。v4/v5系の記事にある`plugin/<name>/plugin.js`は使わない。 
- ESMは`.mjs`になったが、file://で動かすためUMDだけを使う。
- 外部Markdownの読み込みにはサーバーが必要なので使わない。

## 雛形
```html
<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><title>0-3 ミニReact</title>
<link rel="stylesheet" href="../vendor/reveal/dist/reveal.css">
<link rel="stylesheet" href="../vendor/reveal/dist/theme/white.css">
<link rel="stylesheet" href="../vendor/reveal/dist/plugin/highlight/monokai.css">
<link rel="stylesheet" href="../assets/theme.css"></head>
<body><div class="reveal"><div class="slides">
  <section><h2>全部描き直すと何が起きる？</h2>
    <iframe data-src="../../demos/a-full-vs-diff/index.html" width="1100" height="560"></iframe>
    <aside class="notes">自動入力を押し、フォーカスが消えたら「なぜ？」と問う。</aside></section>
  <section><pre><code class="language-js" data-trim data-line-numbers="1|2">
function h(type, props, ...children) {
  return { type, props: props ?? {}, children };
}</code></pre></section>
</div></div>
<script src="../vendor/reveal/dist/reveal.js"></script>
<script src="../vendor/reveal/dist/plugin/notes.js"></script>
<script src="../vendor/reveal/dist/plugin/highlight.js"></script>
<script>Reveal.initialize({ hash: true, width: 1280, height: 720, plugins: [RevealNotes, RevealHighlight] });</script>
</body></html>
```

## 構成ルール
- 各回15〜25枚：前回チェック → 困りごと → 問い → お題（1枚で止める）→ 原理 → 公式リンク → よくある誤解 → 今日の一文 → 次回予告。
- 模範解答のコードはレビュー用のスライドにだけ載せる。
- フォントは`"Hiragino Sans", "Noto Sans JP", sans-serif`。PDFは`?print-pdf`を付けて印刷する。
- `npx serve slides`でも同じように動くことを確認する。