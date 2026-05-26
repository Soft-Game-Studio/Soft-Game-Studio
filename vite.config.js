import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],

  assetsInclude: [
    "**/*.seb",
    "**/*.pdf"
  ],

  build: {
    chunkSizeWarningLimit: 1500,

    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, "/");

          if (normalizedId.includes("/node_modules/")) {

            if (
              /\/node_modules\/(react|react-dom|scheduler)\//.test(normalizedId)
            ) {
              return "vendor-react";
            }

            if (
              normalizedId.includes("/node_modules/react-router") ||
              normalizedId.includes("/node_modules/react-router-dom")
            ) {
              return "vendor-router";
            }

            if (
              normalizedId.includes("/node_modules/firebase") ||
              normalizedId.includes("/node_modules/@firebase/")
            ) {
              return "vendor-firebase";
            }

            if (
              normalizedId.includes("/node_modules/framer-motion") ||
              normalizedId.includes("/node_modules/motion")
            ) {
              return "vendor-motion";
            }

            if (normalizedId.includes("/node_modules/@monaco-editor/")) {
              return "vendor-editor";
            }

            if (normalizedId.includes("/node_modules/katex/")) {
              return "vendor-katex";
            }

            return "vendor";
          }
        }
      }
    }
  }
});
