interface PackageManifest {
  name: string
  display: string
  addon?: boolean
  author?: string
  description?: string
  external?: string[]
  globals?: Record<string, string>
  manualImport?: boolean
  deprecated?: boolean
  submodules?: boolean
  build?: boolean
  iife?: boolean
  cjs?: boolean
  mjs?: boolean
  dts?: boolean
  target?: string
  utils?: boolean
  copy?: string[]
}

export const packages: PackageManifest[] = [
  { name: 'core', display: 'yorjs', build: true, external: ['@yorjs/shared'], globals: { '@yorjs/shared': 'YorShared' } },
  { name: 'cli', display: 'yorjs', build: false },
  { name: 'shared', display: 'yorjs', build: true }
]
