import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { ApiResponse } from '@/types/common'

type RefreshResult = {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

type AuthStateGetter = () => {
  accessToken?: string
  refreshToken?: string
}

type HttpAuthBridge = {
  getAuthState: AuthStateGetter
  onTokenRefresh: (tokens: RefreshResult) => void
  onUnauthorized: () => void
}

declare const __API_BASE_URL__: string | undefined

const apiBaseURL = (typeof __API_BASE_URL__ === 'string' && __API_BASE_URL__ ? __API_BASE_URL__ : '/api').replace(/\/+$/, '')

const http = axios.create({
  baseURL: apiBaseURL,
  timeout: 15000,
})

let isRefreshing = false
let pendingQueue: Array<(token: string) => void> = []
let authBridge: HttpAuthBridge = {
  getAuthState: () => ({}),
  onTokenRefresh: () => undefined,
  onUnauthorized: () => undefined,
}

export const configureHttpAuthBridge = (bridge: HttpAuthBridge) => {
  authBridge = bridge
}

const flushQueue = (token: string) => {
  pendingQueue.forEach((resolve) => resolve(token))
  pendingQueue = []
}

const requestRefreshToken = async (refreshToken: string) => {
  const response = await axios.post<ApiResponse<RefreshResult>>(
    `${apiBaseURL}/auth/refresh-token`,
    { refreshToken },
  )
  return response.data.data
}

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = authBridge.getAuthState().accessToken
  config.headers['Cache-Control'] = 'no-cache'
  config.headers.Pragma = 'no-cache'
  config.headers.Expires = '0'
  delete (config.headers as unknown as Record<string, unknown>)['If-None-Match']
  delete (config.headers as unknown as Record<string, unknown>)['If-Modified-Since']
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => {
    const payload = response.data as ApiResponse<unknown>
    if (payload.code !== 0 && payload.code !== 200) {
      message.error(payload.msg)
      return Promise.reject(payload)
    }
    return response
  },
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
    const authState = authBridge.getAuthState()
    if (error.response?.status === 401 && !originalRequest?._retry && authState.refreshToken) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingQueue.push((token) => {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`,
            }
            resolve(http(originalRequest))
          })
        })
      }
      originalRequest._retry = true
      isRefreshing = true
      try {
        const fresh = await requestRefreshToken(authState.refreshToken)
        authBridge.onTokenRefresh(fresh)
        flushQueue(fresh.accessToken)
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${fresh.accessToken}`,
        }
        return http(originalRequest)
      } catch {
        authBridge.onUnauthorized()
      } finally {
        isRefreshing = false
      }
    }
    message.error(error.response?.data?.msg ?? '网络异常，请稍后再试')
    return Promise.reject(error)
  },
)

export default http
