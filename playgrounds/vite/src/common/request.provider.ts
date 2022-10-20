import axios from 'axios'
import { defineProvider } from '@yorjs/core'

export const RequestProviderImpl = defineProvider()(() => {
  const axiosInstance = axios.create({ baseURL: '/' })

  return axiosInstance
})
