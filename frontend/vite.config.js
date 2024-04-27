// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/CSE442-542/2024-Spring/cse-442l/',
  plugins: [react()]
})