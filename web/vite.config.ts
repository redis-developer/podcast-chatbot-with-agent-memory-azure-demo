import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  resolve: {
    alias: {
      '@root': path.resolve('.'),
      '@app': path.resolve('./src/app'),
      '@components': path.resolve('./src/components'),
      '@services': path.resolve('./src/services'),
      '@views': path.resolve('./src/views')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
