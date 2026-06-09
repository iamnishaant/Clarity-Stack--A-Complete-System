import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 8007,           // Always bind to 8007 — matches iframe URL in ClarityStack (standardized 8000-8007)
    strictPort: true,     // Fail fast instead of silently picking another port
    host: '0.0.0.0',      // Needed so the iframe can reach it from localhost:8006
    cors: true,           // Allow embedding from any origin (iframe parent)
  },
})

