import { fileURLToPath, URL } from 'node:url'

import { defineConfig,loadEnv } from 'vite'

import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite';

import { ElementPlusResolver  } from 'unplugin-vue-components/resolvers'

// import ElementPlus from 'unplugin-element-plus/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()+'/env');
  return {
    plugins: [
      vue(),
      AutoImport({
        imports: [
          'vue', 
          'vue-router'
        ],
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [
          ElementPlusResolver()
        ],
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    define: {
      'process.env': env
    },
    envDir: resolve(__dirname, './env'),
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/scss/abstracts/__abstracts-dir.scss";'
        }
      }
    }
  };
});
