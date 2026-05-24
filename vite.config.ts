import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import axios from "axios";

// const api = window.ipConfing.baseUrl

// let api=''
// axios.get('../../public/config.json').then(res=>
//   api=res.data.apiUrl
// )

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),

  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5174,
    proxy: {
      '/controlApi': { 
        target: 'http://192.168.1.42:12024',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/controlApi/, '') 
      },
      '/smtApi': {
        target: 'http://192.168.9.50:12026',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/smtApi/, '') 
      },
      '/dipApi': {
        target: 'http://192.168.9.50:12022',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dipApi/, '') 
      },
      '/scrApi': {
        target: 'http://192.168.9.50:12025',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/scrApi/, '') 
      },
      '/asyApi': {
        target: 'http://192.168.9.50:12021',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/asyApi/, '') 
      },
     '/reportApi': {
      target: 'http://192.168.9.50:12014',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/reportApi/, '') 
    },
    }
  }
})
