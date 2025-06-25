import { defineConfig } from 'tsup'
import pkg from './package.json'

const sharedConfig = {
  entry: ['src/index.ts'],
  target: 'es2015',
  dts: true,
  clean: true,
  minify: false,
  treeshake: true,
  sourcemap: true,
  splitting: false,
  outDir: 'dist',
  define: {
    __VERSION__: JSON.stringify(pkg.version),
  },
}

export default defineConfig([
  {
    ...sharedConfig,
    format: 'esm',
  },
  {
    ...sharedConfig,
    format: 'cjs',
  },
  {
    ...sharedConfig,
    format: 'iife',
    globalName: 'convnum',
    minify: 'terser',
    sourcemap: false,
  },
])
