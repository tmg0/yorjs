import axios from 'axios'
import { defineInterface, defineProvider } from '@yorjs/core'
import type { AxiosInstance } from 'axios'

export const IAxiosProvider = defineInterface<AxiosInstance>()

export const axiosProvider = defineProvider().implements(IAxiosProvider).inject().setup(() => {
  const axiosInstance = axios.create({ baseURL: '/' })

  return axiosInstance
})
