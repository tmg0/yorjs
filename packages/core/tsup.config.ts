import { defineConfig } from 'tsup'

export default defineConfig(options => ({
  entry: ['./index.ts'],
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: !options.watch
}))
