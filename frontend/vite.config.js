import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxying requests starting with /backend to your PHP server
      '/backend': {
        target: 'http://localhost/React-Guestbook', // The root path to your PHP server
        changeOrigin: true,
      },
      // ... other proxies if necessary
    }
  }
});