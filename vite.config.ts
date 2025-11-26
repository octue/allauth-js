import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  build: {
    lib: {
      // Build multiple entry points so consumers can import subpaths like
      // `@octue/allauth-js/react` or `@octue/allauth-js/nextjs` for better tree-shaking.
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        'react/index': path.resolve(__dirname, 'src/react/index.ts'),
        'nextjs/index': path.resolve(__dirname, 'src/nextjs/index.ts'),
        'core/index': path.resolve(__dirname, 'src/core/index.ts'),
        'tracking/index': path.resolve(__dirname, 'src/tracking/index.ts'),
        'styles/index': path.resolve(__dirname, 'src/styles/index.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'next', 'next/router'],
      output: {
        exports: 'named',
        paths: {
          'next/router': 'next/router.js',
        },
        assetFileNames: (assetInfo) => {
          // Rename the extracted CSS to styles.css
          if (assetInfo.name === 'style.css') return 'styles.css'
          return assetInfo.name || 'assets/[name][extname]'
        },
      },
    },
    cssCodeSplit: false, // Bundle all CSS together
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
