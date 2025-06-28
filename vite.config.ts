import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    chunkSizeWarningLimit: 1000, // Increase limit (default is 500kb)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Split vendor files
          }
        }
      }
    }
  }
});
