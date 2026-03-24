export type RoleCode = 'admin' | 'editor' | 'viewer'

export interface MenuNode {
  key: string
  label: string
  icon?: string
  path?: string
  permission?: string
  children?: MenuNode[]
}

export interface UserProfile {
  id: string
  username: string
  nickname: string
  avatar: string
  roles: RoleCode[]
  permissions: string[]
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

export interface LoginResponse {
  code: number
  msg: string
  data: {
    tokens: AuthTokens
    user: UserProfile
    routes: MenuNode[]
  }
}
