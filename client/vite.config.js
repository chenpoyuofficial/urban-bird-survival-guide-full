import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages 專案頁面會部署在 /urban-bird-survival-guide-full/ 底下，
  // build 時要對齊這個子路徑，本地 dev 維持根目錄
  base: command === 'build' ? '/urban-bird-survival-guide-full/' : '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
}))
