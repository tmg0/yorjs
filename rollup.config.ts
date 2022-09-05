import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'
import type { OutputOptions, RollupOptions } from 'rollup'
import { packages } from './meta/packages'

const configs: RollupOptions[] = []
const esbuildPlugin = esbuild()
const dtsPlugin = dts()
const jsonPlugin = json()

for (const { name, build, cjs, dts } of packages) {
  if (!build) continue

  const functionNames = ['index']

  for (const fn of functionNames) {
    const input =
      fn === 'index' ? `packages/${name}/index.ts` : `packages/${name}/${fn}/index.ts`

    const output: OutputOptions[] = []

    if (cjs !== false) {
      output.push({
        file: `packages/${name}/dist/${fn}.cjs`,
        format: 'cjs'
      })
    }

    configs.push({
      input,
      output,
      plugins: [esbuildPlugin, jsonPlugin],
      external: []
    })

    if (dts !== false) {
      configs.push({
        input,
        output: {
          file: `packages/${name}/dist/${fn}.d.ts`,
          format: 'es'
        },
        plugins: [dtsPlugin]
      })
    }
  }
}

export default configs
