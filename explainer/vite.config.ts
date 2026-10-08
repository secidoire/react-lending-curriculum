import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { mdxPlugin } from './mdx.config.ts';

// React Compiler は使わない。デモで再レンダリングの回数や参照の変化を観察するため。
export default defineConfig({
  base: './',
  plugins: [mdxPlugin(), react({ include: /\.(mdx|js|jsx|ts|tsx)$/ })],
});
