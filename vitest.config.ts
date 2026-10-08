import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import { mdxPlugin } from './explainer/mdx.config.ts';

const exclude = ['**/node_modules/**', '**/dist/**'];

// 拡張子で実行環境を分ける。
//   *.test.ts         … 純粋関数（node環境。時刻は引数で注入する）
//   *.test.tsx        … コンポーネント（Browser Mode + vitest-browser-react）
//   *.browser.test.ts … Reactを使わずDOMを触るコード（ページ内の素のJSの例。Browser Mode）
const browserOnly = '**/*.browser.test.ts';

export default defineConfig({
  test: {
    passWithNoTests: true,
    projects: [
      {
        test: {
          name: 'node',
          environment: 'node',
          include: ['explainer/**/*.test.ts'],
          exclude: [...exclude, browserOnly],
        },
      },
      {
        // 解説ページのMDXも描画して確かめるので、explainer と同じプラグイン構成にする。
        plugins: [mdxPlugin(), react({ include: /\.(mdx|js|jsx|ts|tsx)$/ })],
        // 初回の実行中に依存の事前バンドルがやり直されるとテストが落ちるので、先に列挙しておく。
        optimizeDeps: {
          include: ['vitest-browser-react', 'react', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'zod'],
        },
        test: {
          name: 'browser',
          include: ['explainer/**/*.test.tsx', `explainer/${browserOnly}`],
          exclude,
          // 要素が見つからないときに待つ時間。既定（15秒）のままだと、失敗したときの待ちが長すぎる。
          expect: { poll: { timeout: 2000 } },
          browser: {
            enabled: true,
            provider: playwright({ actionTimeout: 2000 }),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
