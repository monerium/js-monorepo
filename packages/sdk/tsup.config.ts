import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  treeshake: true,
  sourcemap: false,
  minify: true,
  clean: true,
  dts: true,
  splitting: false,
  format: ['esm', 'cjs'],
  external: ['react'],
  injectStyle: false,
});
