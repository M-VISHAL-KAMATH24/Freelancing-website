// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(),tailwindcss()],
//   server: {
//     proxy: {
//       '/api': 'http://localhost:5000'
//     }
//   }
// })

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Proxy for local development only
  server: {
    proxy: process.env.NODE_ENV === 'development' ? {
      '/api': 'http://localhost:5000'
    } : undefined,
  },
  build: {
    rollupOptions: {
      // Ensure gsap is bundled (remove if using CDN)
      external: [], // Empty array means no external dependencies
    },
  },
});