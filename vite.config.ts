import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "AllauthJS",
  fileName: (format, _entryName) => (format === "es" ? "index.mjs" : "index.cjs"),
      formats: ["es", "cjs"],
    },
    sourcemap: true,
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    target: "es2019",
    outDir: "dist",
    emptyOutDir: true,
  },
  plugins: [
    dts({
      entryRoot: "src",
      rollupTypes: true,
      tsconfigPath: path.resolve(__dirname, "tsconfig.build.json"),
      outDir: "dist",
      insertTypesEntry: true,
    }),
  ],
});
