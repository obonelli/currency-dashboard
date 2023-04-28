import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import path from 'path';
import css from 'rollup-plugin-css-only';

export default defineConfig({
  plugins: [
    reactRefresh(),
    css({ output: 'bundle.css' }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
