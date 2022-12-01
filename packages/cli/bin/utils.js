const fs = require('fs-extra')
const { findStaticImports } = require('mlly')
const { Yor } = require('./enums')

const firstLetterUpperCase = str => str.replace(str[0], str[0].toUpperCase())

const I = (str, suffix = 'provider') => `I${firstLetterUpperCase(str)}${firstLetterUpperCase(suffix)}`

const interfaceImportStringify = (lib, str, suffix = []) => {
  const moduleArr = suffix.map(el => I(str, el))
  return `import { ${moduleArr.join(', ')} } from '${lib}'`
}

const controllerTemplate = (str, dependencies = []) => {
  return `import { defineController } from '@yorjs/core'
${interfaceImportStringify(`./${str}.interface`, str, ['controller', ...dependencies])}

export const ${str}Controller = defineController().implements(${I(str, 'controller')}).inject(${dependencies.map(el => I(str, el)).join(', ')}).setup((${dependencies.join(', ')}) => {
  return {
    /** */
  }
})
`
}

const interfaceTemplate = (str, suffix = 'provider') => {
  return `export const ${I(str, suffix)} = defineInterface<{/** */}>()\n`
}

const providerTemplate = (str, dependencies = [], suffix = 'provider') => {
  return `import { defineProvider } from '@yorjs/core'
${interfaceImportStringify(`./${str}.interface`, str, [suffix, ...dependencies])}

export const ${str}${firstLetterUpperCase(suffix)} = defineProvider().implements(${I(str, suffix)}).inject(${dependencies.map(el => I(str, el)).join(', ')}).setup((${dependencies.join(', ')}) => {
  return {
    /** */
  }
})
`
}

const moduleTemplate = (str) => {
  return `import { defineModule } from '@yorjs/core'
import { ${str}Controller } from './${str}.controller'
import { ${str}Service } from './${str}.service'
import { ${str}Repo } from './${str}.repo'

export const ${str}Module = defineModule({
  controller: ${str}Controller,
  providers: [${str}Service, ${str}Repo]
})
`
}

const genInterface = async (str, path = '.', suffix = 'provider') => {
  const YOR_INTERFACE_FILE_NAME = `${path}/${str}.interface.ts`
  await fs.ensureFile(YOR_INTERFACE_FILE_NAME)

  let fileStr = fs.readFileSync(YOR_INTERFACE_FILE_NAME).toString()
  const hasImports = findStaticImports(fileStr).some(({ imports, specifier }) => specifier.includes('@yorjs/core') && imports.includes('defineInterface'))

  if (!hasImports)
    fileStr = `import { defineInterface } from '@yorjs/core'\n\n${fileStr}`

  fs.writeFileSync(YOR_INTERFACE_FILE_NAME, fileStr + interfaceTemplate(str, suffix))
}

const genProvider = async (str, path = '.', dependencies = [], suffix = 'provider') => {
  const YOR_PROVIDER_FILE_NAME = `${path}/${str}.${suffix}.ts`
  await fs.ensureFile(YOR_PROVIDER_FILE_NAME)

  fs.writeFile(YOR_PROVIDER_FILE_NAME, providerTemplate(str, dependencies, suffix))
}

const genController = async (str, path = '.', dependencies = []) => {
  const YOR_INTERFACE_FILE_NAME = `${path}/${str}.controller.ts`
  await fs.ensureFile(YOR_INTERFACE_FILE_NAME)

  fs.writeFile(YOR_INTERFACE_FILE_NAME, controllerTemplate(str, dependencies))
}

const genModule = async (str) => {
  const YOR_MODULR_PATH = `./${str}`
  const YOR_MODULE_FILE_NAME = `${YOR_MODULR_PATH}/${str}.module.ts`

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
