const { program } = require('commander')
const fs = require('fs-extra')

const { version } = require('./package.json')

program.command('create')
  .version(version)
  .description('Split a string into substrings and display as an array')
  .argument('<string>', 'string to split')
  .option('--first', 'display just the first substring')
  .option('-M, --module <char>', 'yor module')
  .action((str, options) => {
    console.log(str)
    console.log(options)
  })

program.parse()
