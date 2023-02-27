import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { ensureFile, mkdir, writeFile } from 'fs-extra'
import { findStaticImports } from 'mlly'
import { camelCase, kebabCase, pascalCase } from 'scule'
import { Yor } from './enums'

const I = (str: string, suffix = 'provider') => `I${pascalCase(str)}${pascalCase(suffix)}`

const interfaceImportStringify = (lib: string, str: string, suffix: string[] = []) => {
  const moduleArr = suffix.map(el => I(str, el))
  return `import { ${moduleArr.join(', ')} } from '${lib}'`
}

export const controllerTemplate = (str: string, dependencies: string[] = []) => {
  return `import { defineController } from '@yorjs/core'
${interfaceImportStringify(`./${kebabCase(str)}.interface`, str, ['controller', ...dependencies])}

export const ${str}Controller = defineController().implements(${I(str, 'controller')}).inject(${dependencies.map(el => I(str, el)).join(', ')}).setup((${dependencies.join(', ')}) => {
  return {
    /** */
  }
})
`
}

export const interfaceTemplate = (str: string, suffix = 'provider') => {
  return `export const ${I(pascalCase(str), suffix)} = defineInterface<{/** */}>()\n`
}

export const providerTemplate = (str: string, dependencies: string[] = [], suffix = 'provider') => {
  return `import { defineProvider } from '@yorjs/core'
${interfaceImportStringify(`./${kebabCase(str)}.interface`, str, [suffix, ...dependencies])}

export const ${str}${pascalCase(suffix)} = defineProvider().implements(${I(str, suffix)}).inject(${dependencies.map(el => I(str, el)).join(', ')}).setup((${dependencies.join(', ')}) => {
  return {
    /** */
  }
})
`
}

const moduleTemplate = (str: string) => {
  return `import { defineModule } from '@yorjs/core'
import { ${camelCase(str)}Controller } from './${kebabCase(str)}.controller'
import { ${camelCase(str)}Service } from './${kebabCase(str)}.service'
import { ${camelCase(str)}Repo } from './${kebabCase(str)}.repo'

export const ${camelCase(str)}Module = defineModule({
  controller: ${camelCase(str)}Controller,
  providers: [${camelCase(str)}Service, ${camelCase(str)}Repo]
})
`
}

const genInterface = async (str: string, path = '.', suffix = 'provider') => {
  const YOR_INTERFACE_FILE_NAME = `${path}/${kebabCase(str)}.interface.ts`
  await ensureFile(YOR_INTERFACE_FILE_NAME)

  let fileStr = readFileSync(YOR_INTERFACE_FILE_NAME).toString()
  const hasImports = findStaticImports(fileStr).some(({ imports, specifier }) => specifier.includes('@yorjs/core') && imports.includes('defineInterface'))

  if (!hasImports) { fileStr = `import { defineInterface } from '@yorjs/core'\n\n${fileStr}` }

  writeFileSync(YOR_INTERFACE_FILE_NAME, fileStr + interfaceTemplate(str, suffix))
}

const genProvider = async (str: string, path = '.', dependencies: string[] = [], suffix = 'provider') => {
  const YOR_PROVIDER_FILE_NAME = `${path}/${kebabCase(str)}.${suffix}.ts`
  await ensureFile(YOR_PROVIDER_FILE_NAME)

  writeFile(YOR_PROVIDER_FILE_NAME, providerTemplate(str, dependencies, suffix))
}

const genController = async (str: string, path = '.', dependencies: string[] = []) => {
  const YOR_INTERFACE_FILE_NAME = `${path}/${kebabCase(str)}.controller.ts`
  await ensureFile(YOR_INTERFACE_FILE_NAME)

  writeFile(YOR_INTERFACE_FILE_NAME, controllerTemplate(str, dependencies))
}

const genModule = async (str: string, path = '.') => {
  const YOR_MODULR_PATH = `${path}/${kebabCase(str)}`
  const YOR_MODULE_FILE_NAME = `${YOR_MODULR_PATH}/${kebabCase(str)}.module.ts`

  if (!existsSync(YOR_MODULR_PATH)) { mkdir(YOR_MODULR_PATH) }

  genInterface(str, YOR_MODULR_PATH, 'repo')
  genProvider(str, YOR_MODULR_PATH, [], 'repo')

  genInterface(str, YOR_MODULR_PATH, 'service')
  genProvider(str, YOR_MODULR_PATH, ['repo'], 'service')

  genInterface(str, YOR_MODULR_PATH, 'controller')
  genController(str, YOR_MODULR_PATH, ['service'])

  await ensureFile(YOR_MODULE_FILE_NAME)
  writeFile(YOR_MODULE_FILE_NAME, moduleTemplate(str))
}

export const templates = {
  [Yor.MODULE]: genModule,
  [Yor.INTERFACE]: genInterface,
  [Yor.PROVIDER]: genProvider,
  [Yor.CONTROLLER]: genController
}
