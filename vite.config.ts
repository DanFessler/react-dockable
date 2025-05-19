import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({ tsconfigPath: "./tsconfig.app.json", rollupTypes: true }),
  ],
  build: {
    lib: {
      entry: "./lib/dockable/index.ts",
      name: "react-dockable",
      fileName: "react-dockable",
    },
    minify: false, // ✅ Disable minification to preserve component names
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
