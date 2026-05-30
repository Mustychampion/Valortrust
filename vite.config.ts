import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import path from 'path';

export default defineConfig({
  base: '/',
  build: {
  outDir: 'dist',
  minify: 'terser',
  sourcemap: process.env.NODE_ENV !== 'production',
  cssCodeSplit: true,
  rollupOptions: {
    input: {
      main: './index.html',
      admin: './admin.html',
    },
    output: {
      entryFileNames: 'assets/[name].[hash].js',
      chunkFileNames: 'assets/[name].[hash].js',
      assetFileNames: 'assets/[name].[hash].[ext]',
      manualChunks(id) {
        if (id.includes('node_modules')) {
          return 'vendor';
        }
      },
    },
  },
},
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@admin': path.resolve(__dirname, './src/admin'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    }
  },
  plugins: [
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'VALORTRUST INTEGRATED SERVICES LTD | RC: 9268182 | Kano, Nigeria',
          // Structured data will be handled directly in the HTML or via JS injection
        }
      }
    })
  ]
});
