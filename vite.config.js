import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 3000,
    hmr: {
      clientPort: process.env.HMR_HOST ? 443 : 3000,
      host: process.env.HMR_HOST
        ? process.env.HMR_HOST.substring("https://".length)
        : "localhost",
    }
  }
})
