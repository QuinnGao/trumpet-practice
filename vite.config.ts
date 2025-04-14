import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const timestamp = new Date().getTime()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 4096,
    rollupOptions: {
      output: {
        chunkFileNames: `static/js/[name]-[hash]-${timestamp}.js`,
        entryFileNames: `static/js/[name]-[hash]-${timestamp}.js`,
        assetFileNames: `static/[ext]/[name]-[hash]-${timestamp}.[ext]`,
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString()
          }
        },
      },
    },
  },
})
