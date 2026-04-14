import { MockMethod } from 'vite-plugin-mock'

const routes = [
  {
    key: 'dashboard',
    label: 'dashboard',
    icon: 'DashboardOutlined',
    path: '/dashboard',
    permission: 'dashboard:view',
  },
  {
    key: 'orders',
    label: 'orders',
    icon: 'ShoppingCartOutlined',
    path: '/orders',
    permission: 'order:view',
  },
  {
    key: 'system',
    label: 'system',
    icon: 'SettingOutlined',
    permission: 'system:read',
    children: [
      { key: 'users', label: 'users', icon: 'UserOutlined', path: '/system/users', permission: 'user:view' },
      { key: 'roles', label: 'roles', icon: 'SafetyCertificateOutlined', path: '/system/roles', permission: 'role:view' },
      { key: 'menus', label: 'menus', icon: 'MenuOutlined', path: '/system/menus', permission: 'menu:view' },
      { key: 'logs', label: 'logs', icon: 'FileSearchOutlined', path: '/system/logs', permission: 'log:view' },
    ],
  },
]

export default [
  {
    url: '/api/auth/login',
    method: 'post',
    response: () => ({
      code: 0,
      msg: 'ok',
      data: {
        tokens: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          expiresAt: Date.now() + 3600_000,
        },
        user: {
          id: '1',
          username: 'admin',
          nickname: '系统管理员',
          avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=admin',
          roles: ['admin'],
          permissions: [
            'dashboard:view',
            'system:read',
            'user:view',
            'user:create',
            'user:update',
            'user:delete',
            'order:view',
            'order:create',
            'order:update',
            'order:delete',
            'role:view',
            'menu:view',
            'log:view',
          ],
        },
        routes,
      },
    }),
  },
  {
    url: '/api/auth/refresh-token',
    method: 'post',
    response: () => ({
      code: 0,
      msg: 'ok',
      data: {
        accessToken: `mock-access-token-${Date.now()}`,
        refreshToken: 'mock-refresh-token',
        expiresAt: Date.now() + 3600_000,
      },
    }),
  },
] as MockMethod[]
