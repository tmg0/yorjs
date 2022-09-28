import { defineProvider } from '@yorjs/core'
import type { Pagination } from '../interfaces/pagination.interface'

export const paginationProvider = defineProvider<Pagination>(() => ({
  current: 1,
  pageSize: 10,
  total: 0,
  rows: []
}))
