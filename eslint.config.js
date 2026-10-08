import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['**/node_modules/', '**/dist/']),

  js.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommended],
    rules: {
      // 型を偽る `as` は禁止（`as const` は対象外）。外部データは unknown で受けて zod で絞る。
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
    },
  },

  // React Compiler 由来のルール（set-state-in-effect など）も recommended に含まれる。
  // Compiler 本体は第7回までOFFだが、lint は初回から有効にする。
  {
    files: ['**/*.{jsx,tsx}'],
    extends: [reactHooks.configs.flat.recommended],
  },

  // `/** @jsx h */` を付けたファイルでは、JSXが h() の呼び出しに変換される。
  // ESLintはそれを知らないので、import した h を「使っていない」と数えないようにする。
  {
    files: ['explainer/src/examples/0-3/**/*.tsx'],
    rules: { '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^h$' }] },
  },

  // ブラウザで動くコード（解説ページと、その中で動かす例）
  {
    files: ['explainer/**'],
    languageOptions: { globals: globals.browser },
  },

  // Node で動く設定ファイル
  {
    files: ['*.config.{js,ts}', '**/*.config.ts'],
    languageOptions: { globals: globals.node },
  },
]);
