import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import vuejs from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vuejs()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      view: path.resolve(__dirname, 'src/views'),
      pkg: path.resolve(__dirname, 'src/components'),
      tool: path.resolve(__dirname, 'src/utils'),
      route: path.resolve(__dirname, 'src/router')
    }
  },
  server: {
    host: '0.0.0.0',
    https: true,
    cors: true
  }
})
