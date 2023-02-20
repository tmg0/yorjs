import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { ensureFile, mkdir, writeFile } from 'fs-extra'
import { findStaticImports } from 'mlly'
import { Yor } from './enums'

const toCamelCase = (str: string) => {
  str = str.replace(str[0], str[0].toLowerCase())

  return str.replace(/-(\w)/g, (_, item) => {
    return item.toUpperCase()
  })
}

const toKebabCase = (str: string) => {
  str = str.replace(/[A-Z]/g, (item) => {
    return `-${item.toLowerCase()}`
  })

  if (str.startsWith('-')) { return str.substr(1) }

  return str
}

const toPascalCase = (str: string) => {
  str = toCamelCase(str)

  return str.replace(str[0], str[0].toUpperCase())
}

const I = (str: string, suffix = 'provider') => `I${toPascalCase(str)}${toPascalCase(suffix)}`

const interfaceImportStringify = (lib: string, str: string, suffix: string[] = []) => {
  const moduleArr = suffix.map(el => I(str, el))
  return `import { ${moduleArr.join(', ')} } from '${lib}'`
}

const controllerTemplate = (str: string, dependencies: string[] = []) => {
  return `import { defineController } from '@yorjs/core'
${interfaceImportStringify(`./${toKebabCase(str)}.interface`, str, ['controller', ...dependencies])}

export const ${str}Controller = defineController().implements(${I(str, 'controller')}).inject(${dependencies.map(el => I(str, el)).join(', ')}).setup((${dependencies.join(', ')}) => {
  return {
    /** */
  }
})
`
}

const interfaceTemplate = (str: string, suffix = 'provider') => {
  return `export const ${I(toPascalCase(str), suffix)} = defineInterface<{/** */}>()\n`
}

const providerTemplate = (str: string, dependencies: string[] = [], suffix = 'provider') => {
  return `import { defineProvider } from '@yorjs/core'
${interfaceImportStringify(`./${toKebabCase(str)}.interface`, str, [suffix, ...dependencies])}

export const ${str}${toPascalCase(suffix)} = defineProvider().implements(${I(str, suffix)}).inject(${dependencies.map(el => I(str, el)).join(', ')}).setup((${dependencies.join(', ')}) => {
  return {
    /** */
  }
})
`
}

const moduleTemplate = (str: string) => {
  return `import { defineModule } from '@yorjs/core'
import { ${toCamelCase(str)}Controller } from './${toKebabCase(str)}.controller'
import { ${toCamelCase(str)}Service } from './${toKebabCase(str)}.service'
import { ${toCamelCase(str)}Repo } from './${toKebabCase(str)}.repo'

export const ${toCamelCase(str)}Module = defineModule({
  controller: ${toCamelCase(str)}Controller,
  providers: [${toCamelCase(str)}Service, ${toCamelCase(str)}Repo]
})
`
}

const genInterface = async (str: string, path = '.', suffix = 'provider') => {
  const YOR_INTERFACE_FILE_NAME = `${path}/${toKebabCase(str)}.interface.ts`
  await ensureFile(YOR_INTERFACE_FILE_NAME)

  let fileStr = readFileSync(YOR_INTERFACE_FILE_NAME).toString()
  const hasImports = findStaticImports(fileStr).some(({ imports, specifier }) => specifier.includes('@yorjs/core') && imports.includes('defineInterface'))

  if (!hasImports) { fileStr = `import { defineInterface } from '@yorjs/core'\n\n${fileStr}` }

  writeFileSync(YOR_INTERFACE_FILE_NAME, fileStr + interfaceTemplate(str, suffix))
}

const genProvider = async (str: string, path = '.', dependencies: string[] = [], suffix = 'provider') => {
  const YOR_PROVIDER_FILE_NAME = `${path}/${toKebabCase(str)}.${suffix}.ts`
  await ensureFile(YOR_PROVIDER_FILE_NAME)

  writeFile(YOR_PROVIDER_FILE_NAME, providerTemplate(str, dependencies, suffix))
}

const genController = async (str: string, path = '.', dependencies: string[] = []) => {
  const YOR_INTERFACE_FILE_NAME = `${path}/${toKebabCase(str)}.controller.ts`
  await ensureFile(YOR_INTERFACE_FILE_NAME)

  writeFile(YOR_INTERFACE_FILE_NAME, controllerTemplate(str, dependencies))
}

const genModule = async (str: string, path = '.') => {
  const YOR_MODULR_PATH = `${path}/${toKebabCase(str)}`
  const YOR_MODULE_FILE_NAME = `${YOR_MODULR_PATH}/${toKebabCase(str)}.module.ts`

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

export {
  controllerTemplate,
  interfaceTemplate,
  providerTemplate
}
