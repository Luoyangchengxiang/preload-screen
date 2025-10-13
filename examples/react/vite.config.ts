import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [
        // 允许插件源码目录
        '../../core/preload-screen/src',
        // 允许示例自身
        '..'
      ]
    }
  }
})
