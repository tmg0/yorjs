export interface WebStorageProvider {
  get: (key: string) => string
  set: (key: string, value: any, expire?: number) => void
  remove: (key: string) => void
}
