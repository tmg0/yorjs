import { describe, expect, test } from 'vitest'
import { useExports, useModule } from '../index'
import { moduleA, moduleB, useModuleA } from './core.spec'

describe('use module', () => {
  test('should have controller method in module', () => {
    const { do: doM } = useModule(moduleA)
    expect(doM('a')).toBe('A')
  })

  test('should inject impls when use provider', () => {
    const { pa: { doA } } = useExports(moduleA)
    expect(doA()).toBe('A')
  })

  test('should use default provider without implements as interface', () => {
    const { do: doB } = useModule(moduleB)
    expect(doB('c')).toBe('C')
  })

  test('should can be used without useModule hook', () => {
    const { do: doM } = useModuleA()
    expect(doM('a')).toBe('A')
  })
})
