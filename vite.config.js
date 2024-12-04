import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: '0.0.0.0',  // Make the server accessible externally
    port: 2345        // Specify the desired port (2345)
  }
})
