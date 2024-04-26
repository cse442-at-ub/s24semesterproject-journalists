import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxying requests starting with /backend to your PHP server
      '/backend': {
<<<<<<< HEAD
        target: 'http://localhost/Journalist', // The root path to your PHP server
=======
        target: 'http://localhost/s24semesterproject-journalists', // The root path to your PHP server
>>>>>>> ab9c4eb (commit to add like button)
        changeOrigin: true,
      },
      // ... other proxies if necessary
    }
  }
});
