# Yorjs

[![NPM version](https://img.shields.io/npm/v/@yorjs/core)](https://www.npmjs.com/package/@yorjs/core)

A DI lib for javascript / typescript.
Without dependency of reflect metadata.
Can be used with esbuild.

## Installation

import package

```
# use npm
npm install @yorjs/core

# use pnpm
pnpm add @yorjs/core
```

import module

```
import { } from '@yorjs/core'
```

## Packages

| Package                          | Version (click for document)                                 |
| -------------------------------- | ------------------------------------------------------------ |
| [@yorjs/core](packages/core)     | [![NPM version](https://img.shields.io/npm/v/@yorjs/core)](packages/core/README.md) |
| [@yorjs/cli](packages/cli)       | [![NPM version](https://img.shields.io/npm/v/@yorjs/cli)](packages/cli/README.md) |
| [@yorjs/shared](packages/shared) | [![NPM version](https://img.shields.io/npm/v/@yorjs/shared)](packages/shared/README.md) |

## Usage

### `Core`

A basic usage of yor. Include define provider / controller / interface / module

```
import { defineProvider, defineController, useModule } from '@yorjs/core'

const provider = defineProvider().setup(() => ({
  do() { return 'done' }
}))

const controller = defineController().inject(provider).setup((p) => {
  let result = ''

  return {
    result,
    do() {
      result = p.do()
    }
  }
})

const module = defineModule({
  controller,
  providers: [provider]
})
```

Use module in `vue` component

```
<script>
import { useModule } from '@yorjs/core'
import { module } from '../eg.module'

<script setup lang="ts">
const userModule = useModule(module)
</script>
```

### `Cli`

The recommended way to create a yor module.

Install cli tool

```
# use npm
npm i @yorjs/cli -g

# use pnpm
pnpm add @yorjs/cli -g
```

Basic usage

```
yor create -h

-V, --version     output the version number
-M, --module      yor module
-I, --interface   yor interface
-P, --provider    yor provider
-C, --controller  yor controller
-h, --help        display help for command
```

## License
[MIT](./LICENSE)