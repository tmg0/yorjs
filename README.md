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

## Usage

### `Core`

A basic usage of yor. Include define provider / controller / interface / module

```
import { defineProvider, defineController, defineInterface,  useModule } from '@yorjs/core'

const IProvider = defineInterface<{
  do: () => string
}>()

const IController = defineController<{
  result: string
  do: () => void
}>()

const provider = defineProvider().implements(IProvider).setup(() => ({
  do() { return 'done' }
}))

const controller = defineController().implements(IController).inject(IProvider).setup((p) => {
  let result = ''

  return {
    result,
    do() {
      result = p.do()
    }
  }
})
```

Use module in `vue` component

```
import { useModule } from '@yorjs/core'
import { userModule } from '../user.module'

<script setup lang="ts">
const userModule = useModule(userModule)
</script>
```

## License
[MIT](./LICENSE)