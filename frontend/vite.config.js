import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/CSE442-542/2024-Spring/cse-442l/',
  plugins: [react()],
  server: {
    proxy: {
      '/backend': {
        target: 'https://www-student.cse.buffalo.edu',
        changeOrigin: true,
        rewrite: path => '/CSE442-542/2024-Spring/cse-442l' + path + '.php'
      },
      // Additional proxies can be added here
    }
  }
});
