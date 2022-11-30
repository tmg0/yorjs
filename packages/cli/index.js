const { program } = require('commander')
const fs = require('fs-extra')
const { Yor, YorAlias } = require('./src/enums')
const { controllerTemplate } = require('./src/utils')
const { version } = require('./package.json')

const genInterface = async (str, { path = '.' } = { path: '.' }) => {
  const YOR_INTERFACE_FILE_NAME = `${path}/${str}.interface.ts`
  await fs.ensureFile(YOR_INTERFACE_FILE_NAME)
}

const genProvider = async (str, { path = '.', suffix = 'provider' } = { path: '.', suffix: 'provider' }) => {
  const YOR_PROVIDER_FILE_NAME = `${path}/${str}.${suffix}.ts`
  await fs.ensureFile(YOR_PROVIDER_FILE_NAME)
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

  genInterface(str, { path: YOR_MODULR_PATH })
  genProvider(str, { path: YOR_MODULR_PATH, suffix: 'service' })
  genProvider(str, { path: YOR_MODULR_PATH, suffix: 'repo' })
  genController(str, YOR_MODULR_PATH, ['service'])

  await fs.ensureFile(YOR_MODULE_FILE_NAME)
}

const templates = {
  [Yor.MODULE]: genModule,
  [Yor.INTERFACE]: genInterface,
  [Yor.PROVIDER]: genProvider,
  [Yor.CONTROLLER]: genController
}

program.command('create')
  .version(version)
  .description('Yor module generator')
  .argument('<string>', 'yor target name')
  .option(`-${YorAlias.MODULE}, --${Yor.MODULE}`, 'yor module')
  .option(`-${YorAlias.INTERFACE}, --${Yor.INTERFACE}`, 'yor interface')
  .option(`-${YorAlias.PROVIDER}, --${Yor.PROVIDER}`, 'yor provider')
  .option(`-${YorAlias.CONTROLLER}, --${Yor.CONTROLLER}`, 'yor controller')
  .action((str, options) => {
    if (options.module) {
      templates[Yor.MODULE](str)
      return
    }

    Object.keys(options).forEach(el => templates[el](str))
  })

program.parse()
