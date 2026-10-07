import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const exclude = ['**/node_modules/**', '**/dist/**'];

// 拡張子で実行環境を分ける。
//   *.test.ts  … ドメイン（node環境。時刻は引数で注入する）
//   *.test.tsx … コンポーネント（Browser Mode + vitest-browser-react）
export default defineConfig({
  test: {
    // 回のファイルがまだ無い段階でもコマンドが通るようにする。
    passWithNoTests: true,
    projects: [
      {
        test: {
          name: 'node',
          environment: 'node',
          include: ['handson/**/*.test.ts', 'explainer/**/*.test.ts'],
          exclude,
        },
      },
      {
        plugins: [react()],
        test: {
          name: 'browser',
          include: ['handson/**/*.test.tsx', 'explainer/**/*.test.tsx'],
          exclude,
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
