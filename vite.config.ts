import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import vuejs from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuejs(),
    Components({
      resolvers: [AntDesignVueResolver()]
    }),
    viteCompression({
      //gzip压缩
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz'
    }),
    process.env.NODE_ENV === 'production' ? visualizer() : null
  ],
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
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
