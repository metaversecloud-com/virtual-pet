import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3012,
    proxy: {
      "/api": "http://localhost:3013/",
    },
  },
  build: {
    outDir: "./build",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@context": path.resolve(__dirname, "./src/context"),
      "@pages": path.resolve(__dirname, "./src/pages"),
    },
  },
});
