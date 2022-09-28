export interface Pagination<T = any> {
  current: number
  pageSize: number
  total: number
  rows: T[]
}
