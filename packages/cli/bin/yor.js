#! /usr/bin/env node

const { program } = require('commander')
const { version } = require('../package.json')
const { Yor, YorAlias } = require('./enums')
const { templates } = require('./utils')

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

