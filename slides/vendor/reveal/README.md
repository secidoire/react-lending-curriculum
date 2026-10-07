# reveal.js 6.0.2（同梱）

npm パッケージ `reveal.js@6.0.2` の `dist/` と `LICENSE` を、無加工でコピーしたものです。
スライドを `file://` で直接開けるようにするため、CDN ではなくここから読み込みます。

## 使うファイル（`docs/slide-spec.md` の雛形どおり）
- `dist/reveal.css` / `dist/reveal.js`（UMD）
- `dist/theme/white.css`
- `dist/plugin/notes.js` / `dist/plugin/highlight.js` / `dist/plugin/highlight/monokai.css`

## 使わないファイル
- `*.mjs`：`file://` では `type="module"` がブロックされる場合があるため使いません。
- `dist/plugin/math.js` と一部のテーマ（beige, blood, league, moon, night, simple, sky, solarized）：
  外部URL（MathJax・Webフォント）を読みに行くため使いません。
- `dist/plugin/markdown.js`：外部Markdownの読み込みにサーバーが必要なため使いません。

## 更新手順
バージョンは `docs/tech-stack.md` が正です。上げるときは先にそちらを変更します。

```sh
npm pack reveal.js@6.0.2
tar xzf reveal.js-6.0.2.tgz
rm -rf slides/vendor/reveal/dist
cp -r package/dist package/LICENSE slides/vendor/reveal/
```
