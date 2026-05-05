import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwind from "tailwindcss"
import autoprefixer from "autoprefixer"

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  server: {
    proxy: {
      "/api": { target: "https://dev-weddinginvitation-b.onrender.com", changeOrigin: true, secure: false },
      "/health": { target: "https://dev-weddinginvitation-b.onrender.com", changeOrigin: true, secure: false },
    },
  },
})
