const fs = require('fs-extra')
const { findStaticImports } = require('mlly')
const { Yor } = require('./enums')

const toCamelCase = (str) => {
  str = str.replace(str[0], str[0].toLowerCase())

  return str.replace(/\-(\w)/g, (_, item) => {
    return item.toUpperCase()
  })
}

const toKebabCase = (str) => {
  str = str.replace(/[A-Z]/g, (item) => {
    return `-${item.toLowerCase()}`
  })

  if (str.startsWith('-'))
    return str.substr(1)

  return str
}

const toPascalCase = (str) => {
  str = toCamelCase(str)

  return str.replace(str[0], str[0].toUpperCase())
}

const I = (str, suffix = 'provider') => `I${toPascalCase(str)}${toPascalCase(suffix)}`

const interfaceImportStringify = (lib, str, suffix = []) => {
  const moduleArr = suffix.map(el => I(str, el))
  return `import { ${moduleArr.join(', ')} } from '${lib}'`
}

const controllerTemplate = (str, dependencies = []) => {
  return `import { defineController } from '@yorjs/core'
${interfaceImportStringify(`./${toKebabCase(str)}.interface`, str, ['controller', ...dependencies])}

export const ${str}Controller = defineController().implements(${I(str, 'controller')}).inject(${dependencies.map(el => I(str, el)).join(', ')}).setup((${dependencies.join(', ')}) => {
  return {
    /** */
  }
})
`
}

const interfaceTemplate = (str, suffix = 'provider') => {
  return `export const ${I(toPascalCase(str), suffix)} = defineInterface<{/** */}>()\n`
}

const providerTemplate = (str, dependencies = [], suffix = 'provider') => {
  return `import { defineProvider } from '@yorjs/core'
${interfaceImportStringify(`./${toKebabCase(str)}.interface`, str, [suffix, ...dependencies])}

export const ${str}${toPascalCase(suffix)} = defineProvider().implements(${I(str, suffix)}).inject(${dependencies.map(el => I(str, el)).join(', ')}).setup((${dependencies.join(', ')}) => {
  return {
    /** */
  }
})
`
}

const moduleTemplate = (str) => {
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

const genInterface = async (str, path = '.', suffix = 'provider') => {
  const YOR_INTERFACE_FILE_NAME = `${path}/${toKebabCase(str)}.interface.ts`
  await fs.ensureFile(YOR_INTERFACE_FILE_NAME)

  let fileStr = fs.readFileSync(YOR_INTERFACE_FILE_NAME).toString()
  const hasImports = findStaticImports(fileStr).some(({ imports, specifier }) => specifier.includes('@yorjs/core') && imports.includes('defineInterface'))

  if (!hasImports)
    fileStr = `import { defineInterface } from '@yorjs/core'\n\n${fileStr}`

  fs.writeFileSync(YOR_INTERFACE_FILE_NAME, fileStr + interfaceTemplate(str, suffix))
}

const genProvider = async (str, path = '.', dependencies = [], suffix = 'provider') => {
  const YOR_PROVIDER_FILE_NAME = `${path}/${toKebabCase(str)}.${suffix}.ts`
  await fs.ensureFile(YOR_PROVIDER_FILE_NAME)

  fs.writeFile(YOR_PROVIDER_FILE_NAME, providerTemplate(str, dependencies, suffix))
}

const genController = async (str, path = '.', dependencies = []) => {
  const YOR_INTERFACE_FILE_NAME = `${path}/${toKebabCase(str)}.controller.ts`
  await fs.ensureFile(YOR_INTERFACE_FILE_NAME)

  fs.writeFile(YOR_INTERFACE_FILE_NAME, controllerTemplate(str, dependencies))
}

const genModule = async (str, path = '.') => {
  const YOR_MODULR_PATH = `${path}/${toKebabCase(str)}`
  const YOR_MODULE_FILE_NAME = `${YOR_MODULR_PATH}/${toKebabCase(str)}.module.ts`

  if (!fs.existsSync(YOR_MODULR_PATH))
    fs.mkdir(YOR_MODULR_PATH)

  genInterface(str, YOR_MODULR_PATH, 'repo')
  genProvider(str, YOR_MODULR_PATH, [], 'repo')

  genInterface(str, YOR_MODULR_PATH, 'service')
  genProvider(str, YOR_MODULR_PATH, ['repo'], 'service')

  genInterface(str, YOR_MODULR_PATH, 'controller')
  genController(str, YOR_MODULR_PATH, ['service'])

  await fs.ensureFile(YOR_MODULE_FILE_NAME)
  fs.writeFile(YOR_MODULE_FILE_NAME, moduleTemplate(str))
}

const templates = {
  [Yor.MODULE]: genModule,
  [Yor.INTERFACE]: genInterface,
  [Yor.PROVIDER]: genProvider,
  [Yor.CONTROLLER]: genController
}

module.exports = {
  controllerTemplate,
  interfaceTemplate,
  providerTemplate,
  templates
}
