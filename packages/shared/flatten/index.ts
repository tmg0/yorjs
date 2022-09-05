export const flatten = <T extends Array<unknown> = any>(arr: T): unknown[] => {
  const flat = [...arr]
  return flat
}
