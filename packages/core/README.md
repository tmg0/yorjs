# Yorjs

[![NPM version](https://img.shields.io/npm/v/@yorjs/core)](https://www.npmjs.com/package/@yorjs/core)

A DI lib for javascript / typescript. Use it like a functional `nestjs` and has full support with types.

Can be used with esbuild. Without dependency of reflect metadata.

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

## Api

- `defineProvider`
- `defineInterface`
- `defineController`
- `defineModule`
- `defineInterceptor`
- `defineGuard`
- `useExports`
- `useModule`
- `useDefindeModule`

## Usage

### `defineProvider`

Define a injectable module.

#### Basic Usage

```ts
import { defineInterface, defineProvider } from '@yorjs/core'

const IP = defineInterface<{
  do: () => string
}>()

const provider = defineProvider().implements(IP).setup(() => ({
  do() {
    return 'DONE'
  }
}))
```

After v2.1.0 It's unnessary to define a interface for provider to implement. Use provider in another provider or controller like interface.

e.g.

```ts
import { defineProvider } from '@yorjs/core'

const providerA = defineProvider().setup(() => ({
  do() {
    return 'DONE'
  }
}))

const providerB = defineProvider().inject(providerA).setup((a) => ({
  do(_params: string) {
    return a.do()
  }
}))
```

If you do not provide a defined interface for provider, should define type info inside current provider, otherwise there are no type when use it.

### `defineController`

Define a controller for view.

#### Basic Usage

```ts
import { defineInterface, defineController } from '@yorjs/core'

const IC = defineInterface<{
  message: string
  doSth: () => void
}>()

const controller = defineController().implements(IC).inject(IP).setup((p) => {
  const msg = ''

  const doSth = () => {
    return p.do()
  }

  return {
    msg,
    doSth
  }
})
```

### `defineModule`

Define a module for controller dependencies relationship.

#### Basic Usage

```ts
import { defineModule } from '@yorjs/core'

const module = defineModule({
  controller: controller,
  providers: [provider]
})
```

### `useModule`

Use a module implement in view.

#### Basic Usage

```ts
import { useModule } from '@yorjs/core'

const { message } = useModule(module)
```

### `useDefineModule`

You dont need to useModule anymore. this function will export a available module to use.

```ts src/controller.ts
import { useDefineModule } from '@yorjs/core'

const useA = useDefineModule({
  controller: controller,
  providers: [provider]
})
```

```ts
const { doSth } = useA()
```

### `defineGuard`

Define a guard for a controller or provider.

Basic Usage

```ts
import { defineGuard } from '@yorjs/core'

export const randomGuard = defineGuard(() => {
  return Math.random() <= 0.5
}).error((context) => {
  // ...
})
```

Binding guards

```ts
import { providerImpl } from '../'

providerImpl.useGuards(randomGuard, otherGuard)
```

### `defineInterceptor`

Define a interceptor for a controller or provider.

Basic Usage

```ts
import { defineInterceptor } from '@yorjs/core'

export const loggingInterceptor = defineInterceptor((context) => {
  // before...

  return () => {
    // after...
  }
})
```

Binding interceptors

```ts
import { providerImpl } from '../'

providerImpl.useGuards(loggingInterceptor, otherInterceptor)
```

## Vue

### `Options Api`

Return module in data.

```ts
<script lang="ts">
import { useModule } from '@yorjs/core'
import { userModule } from '../user.module'

export default {
  data() {
    return {
      userModule: useModule(userModule)
    }
  }
}
<script>
```

### `Composition Api`

With setup script

```ts
<script setup lang="ts">
import { useModule } from '@yorjs/core'
import { userModule } from '../user.module'

const userModule = useModule(userModule)
</script>
```

With defineComponents

```ts
<script lang="ts">
import { defineComponents } from 'vue'
import { useModule } from '@yorjs/core'
import { userModule } from '../user.module'

export default defineComponents({
  setup() {
    const userModule = useModule(userModule)

    return {
      userModule
    }
  }
})
</script>
```

## License
[MIT](./LICENSE)