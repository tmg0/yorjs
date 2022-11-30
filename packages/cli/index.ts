import { program } from 'commander'
import { Yor, YorAlias } from './src/enums'
import { templates } from './src/utils'
import { version } from './package.json'

program.command('create')
  .version(version)
  .description('Yor module generator')
  .argument('<string>', 'yor target name')
  .option(`-${YorAlias.MODULE}, --${Yor.MODULE}`, 'yor module')
  .option(`-${YorAlias.INTERFACE}, --${Yor.INTERFACE}`, 'yor interface')
  .option(`-${YorAlias.PROVIDER}, --${Yor.PROVIDER}`, 'yor provider')
  .option(`-${YorAlias.CONTROLLER}, --${Yor.CONTROLLER}`, 'yor controller')
  .action((str, options: Record<Yor, boolean>) => {
    if (options.module) {
      templates[Yor.MODULE](str)
      return
    }

    Object.keys(options).forEach(el => (templates as any)[el](str))
  })

program.parse()
