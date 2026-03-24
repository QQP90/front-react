import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'
import { AxiosRequestConfig, Method } from 'axios'
import http from '@/services/http'
import { LoginResponse, MenuNode } from '@/types/auth'
import { ApiResponse } from '@/types/common'

type AxiosArgs = {
  url: string
  method?: Method
  data?: unknown
  params?: Record<string, unknown>
}

const axiosBaseQuery =
  (): BaseQueryFn<AxiosArgs, unknown, unknown> =>
  async ({ url, method = 'GET', data, params }) => {
    try {
      const result = await http({
        url,
        method,
        data,
        params,
      } as AxiosRequestConfig)
      const payload = result.data as ApiResponse<unknown>
      return { data: payload.data }
    } catch (axiosError) {
      return { error: axiosError }
    }
  }

export interface UserRow {
  id: string
  username: string
  nickname: string
  role: string
  status: string
  updatedAt: string
}

const normalizePagedData = (raw: unknown): { list: unknown[]; total: number } => {
  if (Array.isArray(raw)) {
    return { list: raw, total: raw.length }
  }
  if (!raw || typeof raw !== 'object') {
    return { list: [], total: 0 }
  }
  const data = raw as Record<string, unknown>
  const listCandidate =
    (data.list as unknown) ??
    (data.items as unknown) ??
    (data.rows as unknown) ??
    (data.records as unknown) ??
    (data.data as unknown) ??
    (data.result as unknown) ??
    (data.table as unknown)
  const list = Array.isArray(listCandidate) ? listCandidate : []
  const totalCandidate =
    (data.total as unknown) ??
    (data.count as unknown) ??
    (data.totalCount as unknown) ??
    (data.totalElements as unknown)
  const total = typeof totalCandidate === 'number' ? totalCandidate : Number(totalCandidate ?? list.length) || list.length
  return { list, total }
}

const toUserRow = (raw: unknown, index: number): UserRow => {
  const row = (raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}) as Record<string, unknown>
  const statusValue = row.status ?? row.enabled ?? row.isEnabled
  const status =
    statusValue === 'enabled' || statusValue === 1 || statusValue === true
      ? 'enabled'
      : statusValue === 'disabled' || statusValue === 0 || statusValue === false
        ? 'disabled'
        : String(statusValue ?? 'enabled')

  const id =
    String(
      row.id ??
        row.ID ??
        row.userId ??
        row.UserId ??
        row.key ??
        row.username ??
        row.userName ??
        `row_${index + 1}`,
    ) || `row_${index + 1}`

  return {
    id,
    username: String(row.username ?? row.userName ?? row.account ?? row.loginName ?? ''),
    nickname: String(row.nickname ?? row.nickName ?? row.displayName ?? row.name ?? ''),
    role: String(row.role ?? row.roleName ?? row.roleCode ?? row.role_code ?? ''),
    status,
    updatedAt: String(
      row.updatedAt ??
        row.updateTime ??
        row.modifiedAt ??
        row.modifyTime ??
        row.updated_at ??
        row.update_time ??
        '',
    ),
  }
}

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Users', 'Menus'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse['data'], { username: string; password: string; captcha: string }>({
      query: (payload) => ({
        url: '/auth/login',
        method: 'POST',
        data: payload,
      }),
    }),
    getUsers: builder.query<
      { list: UserRow[]; total: number },
      { pageNumber: number; pageSize: number } & Record<string, unknown>
    >({
      query: ({ pageNumber, pageSize, ...rest }) => ({
        url: '/table-01',
        method: 'GET',
        params: { pageNumber, pageSize, ...rest },
      }),
      transformResponse: (response: unknown) => {
        const { list, total } = normalizePagedData(response)
        return { list: list.map((item, index) => toUserRow(item, index)), total }
      },
      providesTags: ['Users'],
    }),
    getMenus: builder.query<MenuNode[], void>({
      query: () => ({
        url: '/system/menus',
        method: 'GET',
      }),
      providesTags: ['Menus'],
    }),
  }),
})

export const { useLoginMutation, useGetUsersQuery, useLazyGetUsersQuery, useGetMenusQuery } = baseApi
