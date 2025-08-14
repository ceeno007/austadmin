import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true,
    port: 8081,
    strictPort: true,
    hmr: {
      overlay: true
    }
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'logo/aust-logo.webp.webp.png') {
            return 'logo/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  publicDir: 'public',
}));
