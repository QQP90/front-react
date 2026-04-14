import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'
import { AxiosRequestConfig, Method } from 'axios'
import dayjs from 'dayjs'
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
      const payload = result.data as unknown
      if (payload && typeof payload === 'object' && 'code' in (payload as Record<string, unknown>)) {
        return { data: (payload as ApiResponse<unknown>).data }
      }
      return { data: payload }
    } catch (axiosError) {
      return { error: axiosError }
    }
  }

export interface UserRow {
  id: string
  username: string
  email?: string
  phoneNumber?: string
  firstName?: string
  lastName?: string
  gender?: string
  dateOfBirth?: string
  avatar?: string
  bio?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  isActive?: boolean
  nickname?: string
  role?: string
  status?: string
  createdAt?: string
  updatedAt?: string
}

export interface OrderRow {
  id: string
  orderId: string
  customerName: string
  name: string
  totalPrice: number
  status: string
  createdAt: string
  orderNo?: string
  amount?: number
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
  const total =
    typeof totalCandidate === 'number' ? totalCandidate : Number(totalCandidate ?? list.length) || list.length
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
      row.id ?? row.ID ?? row.userId ?? row.UserId ?? row.key ?? row.username ?? row.userName ?? `row_${index + 1}`,
    ) || `row_${index + 1}`

  const createdAtRaw =
    row.createdAt ?? row.createTime ?? row.created_at ?? row.create_time ?? row.registeredAt ?? row.registered_at
  const createdAtRawString = createdAtRaw === undefined || createdAtRaw === null ? '' : String(createdAtRaw)
  const createdAt =
    createdAtRawString && dayjs(createdAtRawString).isValid()
      ? dayjs(createdAtRawString).format('YYYY-MM-DD')
      : createdAtRawString

  const updatedAtRaw =
    row.updatedAt ?? row.updateTime ?? row.modifiedAt ?? row.modifyTime ?? row.updated_at ?? row.update_time
  const updatedAtRawString = updatedAtRaw === undefined || updatedAtRaw === null ? '' : String(updatedAtRaw)
  const updatedAt =
    updatedAtRawString && dayjs(updatedAtRawString).isValid()
      ? dayjs(updatedAtRawString).format('YYYY-MM-DD')
      : updatedAtRawString

  const isActiveRaw = row.isActive ?? row.active ?? row.IsActive ?? row.Active
  const isActive =
    typeof isActiveRaw === 'boolean' ? isActiveRaw : isActiveRaw === 1 ? true : isActiveRaw === 0 ? false : undefined
  return {
    id,
    username: String(row.username ?? row.userName ?? row.account ?? row.loginName ?? ''),
    email: row.email ? String(row.email) : row.Email ? String(row.Email) : undefined,
    phoneNumber: row.phoneNumber ? String(row.phoneNumber) : row.PhoneNumber ? String(row.PhoneNumber) : undefined,
    firstName: row.firstName ? String(row.firstName) : row.FirstName ? String(row.FirstName) : undefined,
    lastName: row.lastName ? String(row.lastName) : row.LastName ? String(row.LastName) : undefined,
    gender: row.gender ? String(row.gender) : row.Gender ? String(row.Gender) : undefined,
    dateOfBirth: row.dateOfBirth ? String(row.dateOfBirth) : row.DateOfBirth ? String(row.DateOfBirth) : undefined,
    avatar: row.avatar ? String(row.avatar) : row.Avatar ? String(row.Avatar) : undefined,
    bio: row.bio ? String(row.bio) : row.Bio ? String(row.Bio) : undefined,
    address: row.address ? String(row.address) : row.Address ? String(row.Address) : undefined,
    city: row.city ? String(row.city) : row.City ? String(row.City) : undefined,
    state: row.state ? String(row.state) : row.State ? String(row.State) : undefined,
    zipCode: row.zipCode
      ? String(row.zipCode)
      : row.ZipCode
        ? String(row.ZipCode)
        : row.ZipCode
          ? String(row.ZipCode)
          : undefined,
    country: row.country ? String(row.country) : row.Country ? String(row.Country) : undefined,
    isActive,
    nickname: row.nickname ? String(row.nickname) : row.nickName ? String(row.nickName) : undefined,
    role: row.role ? String(row.role) : row.roleName ? String(row.roleName) : undefined,
    status,
    createdAt,
    updatedAt,
  }
}

const toOrderRow = (raw: unknown, index: number): OrderRow => {
  const row = (raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}) as Record<string, unknown>
  const id =
    String(
      row.id ??
        row.ID ??
        row.orderId ??
        row.OrderId ??
        row.key ??
        row.orderNo ??
        row.orderNumber ??
        `order_${index + 1}`,
    ) || `order_${index + 1}`
  const orderId = String(row.orderId ?? row.OrderId ?? id)

  const totalPriceRaw = row.totalPrice ?? row.totalAmount ?? row.total ?? row.amount ?? row.price ?? row.money
  const totalPrice = typeof totalPriceRaw === 'number' ? totalPriceRaw : Number(totalPriceRaw ?? 0) || 0

  const orderNo = String(row.orderNo ?? row.orderNO ?? row.orderNumber ?? row.no ?? '')
  const name = String(row.name ?? row.title ?? orderNo ?? '')
  const createdAtRaw =
    row.createdAt ?? row.orderDate ?? row.createTime ?? row.created_at ?? row.create_time ?? row.order_date
  const createdAtRawString = createdAtRaw === undefined || createdAtRaw === null ? '' : String(createdAtRaw)
  const createdAt =
    createdAtRawString && dayjs(createdAtRawString).isValid()
      ? dayjs(createdAtRawString).format('YYYY-MM-DD')
      : createdAtRawString

  return {
    id,
    orderId,
    customerName: String(row.customerName ?? row.customer ?? row.buyer ?? row.userName ?? row.username ?? ''),
    name,
    totalPrice,
    status: String(row.status ?? row.state ?? row.orderStatus ?? 'pending'),
    createdAt,
    orderNo,
    amount: totalPrice,
  }
}

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Users', 'Orders', 'Menus'],
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
        url: '/Users',
        method: 'GET',
        params: { PageNumber: pageNumber, PageSize: pageSize, ...rest },
      }),
      transformResponse: (response: unknown) => {
        const { list, total } = normalizePagedData(response)
        return { list: list.map((item, index) => toUserRow(item, index)), total }
      },
      providesTags: ['Users'],
    }),
    createUser: builder.mutation<unknown, Record<string, unknown>>({
      query: (payload) => ({
        url: '/Users',
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['Users'],
    }),
    getUserById: builder.query<UserRow, { userId: string }>({
      query: ({ userId }) => ({
        url: `/Users/${userId}`,
        method: 'GET',
      }),
      transformResponse: (response: unknown) => toUserRow(response, 0),
      providesTags: ['Users'],
    }),
    updateUser: builder.mutation<unknown, { userId: string } & Record<string, unknown>>({
      query: ({ userId, ...payload }) => ({
        url: `/Users/${userId}`,
        method: 'PUT',
        data: payload,
      }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation<unknown, { userId: string }>({
      query: ({ userId }) => ({
        url: `/Users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
    getOrders: builder.query<
      { list: OrderRow[]; total: number },
      { pageNumber: number; pageSize: number } & Record<string, unknown>
    >({
      query: ({ pageNumber, pageSize, ...rest }) => ({
        url: '/Order',
        method: 'GET',
        params: { PageNumber: pageNumber, PageSize: pageSize, ...rest },
      }),
      transformResponse: (response: unknown) => {
        const { list, total } = normalizePagedData(response)
        return { list: list.map((item, index) => toOrderRow(item, index)), total }
      },
      providesTags: ['Orders'],
    }),
    createOrder: builder.mutation<unknown, Partial<OrderRow> & Record<string, unknown>>({
      query: (payload) => ({
        url: '/Order',
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['Orders'],
    }),
    updateOrder: builder.mutation<unknown, { orderId: string } & Record<string, unknown>>({
      query: ({ orderId, ...payload }) => ({
        url: `/Order/${orderId}`,
        method: 'PUT',
        data: payload,
      }),
      invalidatesTags: ['Orders'],
    }),
    deleteOrder: builder.mutation<unknown, { orderId: string }>({
      query: ({ orderId }) => ({
        url: `/Order/${orderId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Orders'],
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

export const {
  useLoginMutation,
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useCreateUserMutation,
  useLazyGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetOrdersQuery,
  useLazyGetOrdersQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetMenusQuery,
} = baseApi
