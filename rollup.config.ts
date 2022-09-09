import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'
import type { OutputOptions, RollupOptions } from 'rollup'
import { packages } from './meta/packages'
import { name as iifeName } from './package.json'

const configs: RollupOptions[] = []

for (const { name, build, external, globals } of packages) {
  if (!build) continue

  const functionNames = ['index']

  for (const fn of functionNames) {
    const input = fn === 'index' ? `packages/${name}/index.ts` : `packages/${name}/${fn}/index.ts`

    const output: OutputOptions[] = [
      { file: `packages/${name}/dist/${fn}.mjs`, format: 'es' },
      { file: `packages/${name}/dist/${fn}.cjs`, format: 'cjs' },
      { file: `packages/${name}/dist/${fn}.iife.js`, format: 'iife', name: iifeName, globals },
      { file: `packages/${name}/dist/${fn}.iife.min.js`, format: 'iife', name: iifeName, globals }
    ]

    configs.push({
      input,
      output,
      plugins: [esbuild(), json()],
      external
    })

    configs.push({
      input,
      output: {
        file: `packages/${name}/dist/${fn}.d.ts`,
        format: 'es'
      },
      plugins: [dts()]
    })
  }
}

export default configs
