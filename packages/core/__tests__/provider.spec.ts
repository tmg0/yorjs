import { describe, expect, test } from 'vitest'
import { defineProvider } from '../src/defineProvider'
import { controllerA, providerA } from './core.spec'

describe('define provider', () => {
  test('should have provider dependencies in metadata', () => {
    expect(!!controllerA.dependencies).toBe(true)
  })

  test('should have provider name as enum', () => {
    expect(providerA.name).toBe('pa')
  })

  test('should have default interface in provider', () => {
    const noImplsP = defineProvider().setup(() => ({ do (str: string) { return 'done: ' + str } }))
    expect(noImplsP.metadata.interface.implements.length).toBe(1)
  })
})
