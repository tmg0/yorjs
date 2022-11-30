const firstLetterUpperCase = str => str.replace(str[0], str[0].toUpperCase())

const I = (str, suffix = 'provider') => `I${firstLetterUpperCase(str)}${firstLetterUpperCase(suffix)}`

const interfaceImportStringify = (lib, str, suffix = []) => {
  const moduleArr = suffix.map(el => I(str, el))
  return `import { ${moduleArr.join(', ')} } from '${lib}'`
}

const controllerTemplate = (str, dependencies = []) => {
  return `import { defineController } from '@yorjs/core'
${interfaceImportStringify(`./${str}.interface.ts`, str, ['controller', ...dependencies])}

export const ${str}Controller = defineController().implements(${I(str, 'controller')}).inject(${dependencies.map(el => I(str, el)).join(', ')}).setup((${dependencies.join(', ')}) => {
  return {
    /** */
  }
})
`
}

const interfaceTemplate = () => ''

exports.controllerTemplate = controllerTemplate
exports.interfaceTemplate = interfaceTemplate
