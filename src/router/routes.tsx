import { lazy } from 'react'
import { MenuNode } from '@/types/auth'

export const routeComponents = {
  '/dashboard': lazy(() => import('@/views/dashboard')),
  '/system/users': lazy(() => import('@/views/system/users')),
  '/system/roles': lazy(() => import('@/views/system/roles')),
  '/system/menus': lazy(() => import('@/views/system/menus')),
  '/system/logs': lazy(() => import('@/views/system/logs')),
}

export const staticMenus: MenuNode[] = [
  {
    key: 'dashboard',
    label: 'dashboard',
    icon: 'DashboardOutlined',
    path: '/dashboard',
    permission: 'dashboard:view',
  },
  {
    key: 'system',
    label: 'system',
    icon: 'SettingOutlined',
    permission: 'system:read',
    children: [
      {
        key: 'users',
        label: 'users',
        icon: 'UserOutlined',
        path: '/system/users',
        permission: 'user:view',
      },
      {
        key: 'roles',
        label: 'roles',
        icon: 'SafetyCertificateOutlined',
        path: '/system/roles',
        permission: 'role:view',
      },
      {
        key: 'menus',
        label: 'menus',
        icon: 'MenuOutlined',
        path: '/system/menus',
        permission: 'menu:view',
      },
      {
        key: 'logs',
        label: 'logs',
        icon: 'FileSearchOutlined',
        path: '/system/logs',
        permission: 'log:view',
      },
    ],
  },
]
