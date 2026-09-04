import stylex from "@stylexjs/unplugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    stylex.vite({
      useCSSLayers: true,
      unstable_moduleResolution: {
        type: "commonJS",
        rootDir: import.meta.dirname,
      },
    }),
    react(),
  ],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});
