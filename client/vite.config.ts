import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(
  // config can be an object or a function
  ({ mode }) => ({
    plugins: [
      tailwindcss(),
      vue(),
      // enable dev tools using `vite --mode devtools` (or `npm run dev:tools` from the package.json scripts)
      ...(mode === 'devtools' ? [vueDevTools()] : []),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        // Point Vite at the TS source directly so it never serves the CJS dist.
        // The shared package compiles to CommonJS for the server; aliasing here
        // means the browser build gets native ESM without a dual-build setup.
        '@brewhaus/shared': fileURLToPath(new URL('../shared', import.meta.url)),
      },
    },
  }),
)
