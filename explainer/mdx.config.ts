import mdx from '@mdx-js/rollup';
import rehypeShiki, { type RehypeShikiOptions } from '@shikijs/rehype';
import type { PluginOption } from 'vite';
import { lineHighlightTransformer } from './shiki/lineHighlightTransformer.ts';

const shikiOptions: RehypeShikiOptions = {
  theme: 'github-light',
  langs: ['html', 'css', 'js', 'jsx', 'ts', 'tsx', 'json', 'bash'],
  transformers: [lineHighlightTransformer],
};

// MDXをReactコンポーネントに変換するプラグイン。
// @vitejs/plugin-react より前に動かす必要があるので enforce: 'pre' を付ける（MDX公式のViteの手順）。
// 解説ページ（vite.config.ts）とテスト（ルートの vitest.config.ts）の両方から使う。
export function mdxPlugin(): PluginOption {
  return {
    enforce: 'pre',
    ...mdx({ rehypePlugins: [[rehypeShiki, shikiOptions]] }),
  };
}
