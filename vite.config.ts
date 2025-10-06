import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    lib: {
      // lib mode still wants an entry; keep a small index (can be empty or re-exports)
      entry: { index: 'src/index.ts' },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    // Build multiple entry points so consumers can import subpaths like
    // `@octue/allauth-js/react` or `@octue/allauth-js/nextjs` for better tree-shaking.
    // entry: {
    //   index: path.resolve(__dirname, 'src/index.ts'),
    //   react: path.resolve(__dirname, 'src/react/index.ts'),
    //   nextjs: path.resolve(__dirname, 'src/nextjs/index.ts'),
    //   core: path.resolve(__dirname, 'src/core/index.ts'),
    //   tracking: path.resolve(__dirname, 'src/tracking/index.ts'),
    // }
    rollupOptions: {
      external: ['react', 'react-dom', 'next', 'next/router'],
      output: {
        dir: 'dist',
        preserveModules: true,
        preserveModulesRoot: 'src',
        exports: 'named',
      },
    },
    sourcemap: true,
    target: 'es2019',
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [
    react(),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.resolve(__dirname, 'tsconfig.build.json'),
      outDir: 'dist',
    }),
  ],
})
