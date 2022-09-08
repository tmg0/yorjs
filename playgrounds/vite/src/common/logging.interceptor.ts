import { defineInterceptor } from '@yor/core'

export const LoggingInterceptor = defineInterceptor((context) => {
  console.log('Before...')
  console.log(context)

  return () => {
    console.log('After...')
  }
})
