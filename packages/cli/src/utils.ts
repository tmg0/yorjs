import fs from 'fs-extra'
import { findStaticImports } from 'mlly'
import MagicString from 'magic-string'
import { Yor } from './enums'

const firstLetterUpperCase = (str: string) => str.replace(str[0], str[0].toUpperCase())

const I = (str: string, suffix = 'provider') => `I${firstLetterUpperCase(str)}${firstLetterUpperCase(suffix)}`

const interfaceImportStringify = (lib: string, str: string, suffix: string[] = []) => {
  const moduleArr = suffix.map(el => I(str, el))
  return `import { ${moduleArr.join(', ')} } from '${lib}'`
}

export const controllerTemplate = (str: string, dependencies: string[] = []) => {
  return `import { defineController } from '@yorjs/core'
${interfaceImportStringify(`./${str}.interface`, str, ['controller', ...dependencies])}

export const ${str}Controller = defineController().implements(${I(str, 'controller')}).inject(${dependencies.map(el => I(str, el)).join(', ')}).setup((${dependencies.join(', ')}) => {
  return {
    /** */
  }
})
`
}

export const interfaceTemplate = (str: string, suffix = 'provider') => {
  return `export const ${I(str, suffix)} = defineInterface<{/** */}>()\n`
}

export const providerTemplate = (str: string, dependencies: string[] = [], suffix = 'provider') => {
  return `import { defineProvider } from '@yorjs/core'
${interfaceImportStringify(`./${str}.interface`, str, [suffix, ...dependencies])}

export const ${str}${firstLetterUpperCase(suffix)} = defineProvider().implements(${I(str, suffix)}).inject(${dependencies.map(el => I(str, el)).join(', ')}).setup((${dependencies.join(', ')}) => {
  return {
    /** */
  }
})
`
}

const moduleTemplate = (str: string) => {
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

const genInterface = async (str: string, path = '.', suffix = 'provider') => {
  const YOR_INTERFACE_FILE_NAME = `${path}/${str}.interface.ts`
  await fs.ensureFile(YOR_INTERFACE_FILE_NAME)

  const fileStr = fs.readFileSync(YOR_INTERFACE_FILE_NAME).toString()
  const hasImports = findStaticImports(fileStr).some(({ imports, specifier }) => specifier.includes('@yorjs/core') && imports.includes('defineInterface'))

  const s = new MagicString(fileStr)

  if (!hasImports)
    s.prepend('import { defineInterface } from \'@yorjs/core\'\n\n')

  fs.writeFileSync(YOR_INTERFACE_FILE_NAME, s.append(interfaceTemplate(str, suffix)).toString())
}

const genProvider = async (str: string, path = '.', dependencies: string[] = [], suffix = 'provider') => {
  const YOR_PROVIDER_FILE_NAME = `${path}/${str}.${suffix}.ts`
  await fs.ensureFile(YOR_PROVIDER_FILE_NAME)

  fs.writeFile(YOR_PROVIDER_FILE_NAME, providerTemplate(str, dependencies, suffix))
}

const genController = async (str: string, path = '.', dependencies: string[] = []) => {
  const YOR_INTERFACE_FILE_NAME = `${path}/${str}.controller.ts`
  await fs.ensureFile(YOR_INTERFACE_FILE_NAME)

  fs.writeFile(YOR_INTERFACE_FILE_NAME, controllerTemplate(str, dependencies))
}

const genModule = async (str: string) => {
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

export const templates = {
  [Yor.MODULE]: genModule,
  [Yor.INTERFACE]: genInterface,
  [Yor.PROVIDER]: genProvider,
  [Yor.CONTROLLER]: genController
}
