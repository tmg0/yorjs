import axios from 'axios'
import { defineInterface, defineProvider } from '@yorjs/core'
import type { AxiosInstance } from 'axios'

export const IRequestProvider = defineInterface<AxiosInstance>()

export const requestProvider = defineProvider().implements(IRequestProvider).build(() => {
  const axiosInstance = axios.create({ baseURL: '/' })

  return axiosInstance
})
