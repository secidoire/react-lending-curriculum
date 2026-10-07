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

  // ブラウザで動くコード（素のJS、ミニReact、Reactアプリ、解説ページ）
  {
    files: ['handson/**', 'explainer/**'],
    languageOptions: { globals: globals.browser },
  },

  // Node で動く設定ファイル
  {
    files: ['*.config.{js,ts}', '**/vite.config.ts', '**/vitest.config.ts'],
    languageOptions: { globals: globals.node },
  },
]);
