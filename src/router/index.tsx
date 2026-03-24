import { Result, Spin } from 'antd'
import type { ComponentType } from 'react'
import { Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import { routeComponents } from '@/router/routes'
import LoginPage from '@/views/login'
import ForbiddenPage from '@/views/errors/403'
import NotFoundPage from '@/views/errors/404'

const renderRoute = (Component: ComponentType) => (
  <Suspense
    fallback={
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '50vh' }}>
        <Spin size="large" />
      </div>
    }
  >
    <Component />
  </Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      ...Object.entries(routeComponents).map(([path, Component]) => ({
        path,
        element: renderRoute(Component),
      })),
      { path: '/403', element: <ForbiddenPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '*',
    element: (
      <Result
        status="404"
        title="404"
        subTitle="页面不存在"
        extra={<Navigate to="/dashboard" replace />}
      />
    ),
  },
])
