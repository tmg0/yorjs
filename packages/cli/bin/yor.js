#! /usr/bin/env node

const { program } = require('commander')
const { version } = require('../package.json')
const { Yor, YorAlias } = require('./enums')
const { templates } = require('./utils')

program.command('create')
  .version(version)
  .description('Quick create yor module.')
  .argument('<string>', 'Yor target module name.')
  .option(`-${YorAlias.MODULE}, --${Yor.MODULE}`, 'Generate yor module dir, includes interface / controller / service / repo file, this command will create such files and export named vars from input argument.')
  .option(`-${YorAlias.INTERFACE}, --${Yor.INTERFACE}`, 'Generate a yor interface, if there exist a named file this command will add interface at the end of file, or will create a new file.')
  .option(`-${YorAlias.PROVIDER}, --${Yor.PROVIDER}`, 'Generate yor provider, and define current provider interface in same file.')
  .option(`-${YorAlias.CONTROLLER}, --${Yor.CONTROLLER}`, 'Generate yor controller, and define current controller interface in same file.')
  .option('--path <char>', 'Declare the target files / dir generation path.')
  .action((str, options) => {
    if (options[Yor.MODULE]) {
      templates[Yor.MODULE](str, options.path)
      return
    }

    if (options[Yor.INTERFACE])
      templates[Yor.INTERFACE](str, options.path)

    if (options[Yor.PROVIDER])
      templates[Yor.PROVIDER](str, options.path)

    if (options[Yor.INTERFACE])
      templates[Yor.INTERFACE](str, options.path)
  })

program.parse(process.argv)
