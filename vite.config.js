import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: '/kopis/',
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://www.kopis.or.kr/openApi/restful',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/naver-api': {
          target: 'https://openapi.naver.com/v1/search/blog.json',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/naver-api/, ''),
          headers: {
            'X-Naver-Client-Id': env.VITE_NAVER_CLIENT_ID || '',
            'X-Naver-Client-Secret': env.VITE_NAVER_CLIENT_SECRET || '',
          }
        },
      },
    },
  }
})
