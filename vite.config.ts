import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: './frontend',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './frontend'),
      '@components': path.resolve(__dirname, './frontend/components'),
      '@layouts': path.resolve(__dirname, './frontend/layouts'),
      '@pages': path.resolve(__dirname, './frontend/pages'),
      '@hooks': path.resolve(__dirname, './frontend/hooks'),
      '@contexts': path.resolve(__dirname, './frontend/contexts'),
      '@services': path.resolve(__dirname, './frontend/services'),
      '@types': path.resolve(__dirname, './frontend/types'),
      '@utils': path.resolve(__dirname, './frontend/utils'),
      '@styles': path.resolve(__dirname, './frontend/styles')
    }
  }
});