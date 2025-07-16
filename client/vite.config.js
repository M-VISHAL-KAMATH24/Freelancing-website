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

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: typeof import.meta.env !== 'undefined' && import.meta.env.dev ? {
      '/api': import.meta.env.VITE_API_URL || 'http://localhost:5000',
    } : undefined,
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
});