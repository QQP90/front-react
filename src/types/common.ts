export interface ApiResponse<T> {
  code: number
  msg: string
  data: T
}

export interface PaginationParams {
  current?: number
  pageSize?: number
}

export interface PaginationData<T> {
  total: number
  list: T[]
}
