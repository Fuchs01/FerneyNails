import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
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
      '@': path.resolve(__dirname, '.'),
      '@components': path.resolve(__dirname, './components'),
      '@layouts': path.resolve(__dirname, './layouts'),
      '@pages': path.resolve(__dirname, './pages'),
      '@hooks': path.resolve(__dirname, './hooks'),
      '@contexts': path.resolve(__dirname, './contexts'),
      '@services': path.resolve(__dirname, './services'),
      '@types': path.resolve(__dirname, './types'),
      '@utils': path.resolve(__dirname, './utils'),
      '@styles': path.resolve(__dirname, './styles')
    }
  },
  base: '',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
});