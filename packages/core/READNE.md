# Yorjs

[![NPM version](https://img.shields.io/npm/v/@yorjs/core)](https://www.npmjs.com/package/@yorjs/core)

A DI framework for frontend.

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

### `defineProvider`

Define a injectable module.

#### Basic Usage

```
import { defineProvider } from '@yorjs/core'

interface Provider {
  do: () => void
}

const providerImpl = defineProvider<Provider>(() => ({
  do() { return 'done' }
}))
```

### `defineController`

Define a controller for view.

#### Basic Usage

```
import { defineController } from '@yorjs/core'

interface Controller {
  message: string
  doSth: () => void
}

const controllerImpl = defineController<Controller>((provider: Provider) => {
  const message = ''

  const doSth = () => {
    message = provider.do()
  }

  return { message, doSth }
})
```

### `defineModule`

Define a module for controller dependencies relationship.

#### Basic Usage

```
import { defineModule } from '@yorjs/core'

const module = defineModule({
  controller: controllerImpl.dependencies(providerImpl),
  providers: [providerImpl]
})
```

### `useModule`

Use a module implement in view.

#### Basic Usage

```
import { useModule } from '@yorjs/core'

const { message } = useModule(module)
```

## License
[MIT](./LICENSE)