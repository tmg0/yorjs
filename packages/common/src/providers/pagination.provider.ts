import { defineInterface, defineProvider } from '@yorjs/core'
import type { Pagination } from '../interfaces/pagination.interface'

export const IPagination = defineInterface<Pagination>()

export const paginationProvider = defineProvider().implements(IPagination).setup(() => ({
  current: 1,
  pageSize: 10,
  total: 0,
  rows: []
}))
