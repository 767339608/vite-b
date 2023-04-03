import { defineConfig, PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import vitePluginSettingCssModule from 'vite-plugin-setting-css-module';
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.tsx', '.json', '.less', '.css']
  },
  build: {
    rollupOptions: {
      external: []
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  css: {
    modules: {
      scopeBehaviour: null
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      },

    }
  },
  base: "./",
  plugins: [
    vitePluginSettingCssModule() as PluginOption,
    react({
      tsDecorators: true
    })
  ],
})
