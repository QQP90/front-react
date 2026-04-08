import {
  DashboardOutlined,
  FileSearchOutlined,
  GlobalOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  ShoppingCartOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  SettingOutlined,
  SunOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Breadcrumb, Button, Drawer, Dropdown, Grid, Input, Layout, Menu, Space, Switch, Typography } from 'antd'
import { ItemType } from 'antd/es/menu/interface'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { staticMenus } from '@/router/routes'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { clearSession } from '@/stores/slices/authSlice'
import { setLanguage, setSidebarCollapsed, toggleDarkMode } from '@/stores/slices/preferencesSlice'
import { MenuNode } from '@/types/auth'
import { contentStyle, headerStyle, layoutStyle, siderLogoStyle, siderStyle } from './styles'

const { Header, Content, Sider } = Layout

const iconMap: Record<string, ReactNode> = {
  DashboardOutlined: <DashboardOutlined />,
  SettingOutlined: <SettingOutlined />,
  UserOutlined: <UserOutlined />,
  ShoppingCartOutlined: <ShoppingCartOutlined />,
  SafetyCertificateOutlined: <SafetyCertificateOutlined />,
  MenuOutlined: <MenuOutlined />,
  FileSearchOutlined: <FileSearchOutlined />,
}

const toMenuItems = (menus: MenuNode[], permissions: string[]): ItemType[] =>
  menus
    .filter((item) => !item.permission || permissions.includes(item.permission))
    .map((menu) => ({
      key: menu.path ?? menu.key,
      icon: menu.icon ? iconMap[menu.icon] : undefined,
      label: menu.path ? <Link to={menu.path}>{menu.label}</Link> : menu.label,
      children: menu.children ? toMenuItems(menu.children, permissions) : undefined,
    }))

const flattenMenus = (menus: MenuNode[], permissions: string[]): Array<{ path: string; label: string }> => {
  return menus.flatMap((menu) => {
    if (menu.permission && !permissions.includes(menu.permission)) {
      return []
    }
    const self = menu.path ? [{ path: menu.path, label: menu.label }] : []
    const child = menu.children ? flattenMenus(menu.children, permissions) : []
    return [...self, ...child]
  })
}

const hasMenuPath = (menus: MenuNode[], path: string): boolean => {
  return menus.some((menu) => {
    if (menu.path === path) {
      return true
    }
    return menu.children ? hasMenuPath(menu.children, path) : false
  })
}

function AppLayout() {
  const { t, i18n } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { md } = Grid.useBreakpoint()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { sidebarCollapsed, darkMode } = useAppSelector((state) => state.preferences)
  const token = useAppSelector((state) => state.auth.tokens?.accessToken)
  const permissions = useAppSelector((state) => state.auth.user?.permissions ?? [])
  const dynamicRoutes = useAppSelector((state) => state.auth.routes)
  const profile = useAppSelector((state) => state.auth.user)
  const sourceMenus = useMemo(() => {
    if (!dynamicRoutes.length) {
      return staticMenus
    }
    const ordersNode = staticMenus.find((menu) => menu.key === 'orders' && menu.path === '/orders')
    if (!ordersNode) {
      return dynamicRoutes
    }
    const lowerPermissions = permissions.map((p) => p.toLowerCase())
    const hasAnyOrderPermission =
      lowerPermissions.includes('order:view') || lowerPermissions.some((p) => p.startsWith('order:'))

    if (ordersNode.permission && !hasAnyOrderPermission) {
      return dynamicRoutes
    }
    if (hasMenuPath(dynamicRoutes, '/orders')) {
      return dynamicRoutes
    }
    if (hasMenuPath(dynamicRoutes, '/system/orders')) {
      return dynamicRoutes
    }
    const merged = [...dynamicRoutes]
    const dashboardIndex = merged.findIndex((menu) => menu.path === '/dashboard')
    merged.splice(dashboardIndex >= 0 ? dashboardIndex + 1 : 0, 0, {
      ...ordersNode,
      permission: lowerPermissions.includes('order:view') ? ordersNode.permission : undefined,
    })
    return merged
  }, [dynamicRoutes, permissions])
  const menus = useMemo(() => toMenuItems(sourceMenus, permissions), [permissions, sourceMenus])
  const menuFlat = useMemo(() => flattenMenus(sourceMenus, permissions), [permissions, sourceMenus])
  const selectedKeys = [location.pathname]
  const allowedPaths = useMemo(() => new Set(menuFlat.map((item) => item.path)), [menuFlat])
  const siderTheme = darkMode ? 'dark' : 'light'

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true })
      return
    }
    if (location.pathname !== '/dashboard' && location.pathname !== '/403' && !allowedPaths.has(location.pathname)) {
      navigate('/403', { replace: true })
    }
  }, [allowedPaths, location.pathname, navigate, token])

  const breadcrumbs = location.pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, arr) => {
      const path = `/${arr.slice(0, index + 1).join('/')}`
      const current = menuFlat.find((menu) => menu.path === path)
      return {
        title: current ? t(current.label) : segment,
      }
    })

  const onLogout = () => {
    dispatch(clearSession())
    navigate('/login', { replace: true })
  }

  const userMenu = [
    { key: 'logout', icon: <LogoutOutlined />, label: t('logout'), onClick: onLogout },
  ]

  const siderMenu = (
    <Menu
      mode="inline"
      theme={siderTheme}
      selectedKeys={selectedKeys}
      items={menus}
      style={{ borderRight: 0, height: 'calc(100vh - 64px)' }}
      onClick={() => {
        if (!md) {
          setMobileOpen(false)
        }
      }}
    />
  )

  return (
    <Layout style={layoutStyle} data-theme={darkMode ? 'dark' : 'light'}>
      {md ? (
        <Sider trigger={null} collapsible collapsed={sidebarCollapsed} width={240} style={siderStyle} theme={siderTheme}>
          <div
            style={{
              ...siderLogoStyle,
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              padding: sidebarCollapsed ? 0 : siderLogoStyle.padding,
              color: 'var(--text-color)',
            }}
          >
            <SettingOutlined style={{ fontSize: 18 }} />
            {!sidebarCollapsed && (
              <Typography.Text
                strong
                ellipsis={{ tooltip: t('appName') }}
                style={{ flex: 1, fontSize: 14, lineHeight: '22px', margin: 0, color: 'inherit' }}
              >
                {t('appName')}
              </Typography.Text>
            )}
          </div>
          {siderMenu}
        </Sider>
      ) : (
        <Drawer open={mobileOpen} title={t('appName')} onClose={() => setMobileOpen(false)} placement="left" width={240}>
          {siderMenu}
        </Drawer>
      )}
      <Layout>
        <Header style={headerStyle}>
          <Space size={12}>
            {md ? (
              <Button
                type="text"
                icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => dispatch(setSidebarCollapsed(!sidebarCollapsed))}
              />
            ) : (
              <Button type="text" icon={<MenuOutlined />} onClick={() => setMobileOpen(true)} />
            )}
            <Breadcrumb items={breadcrumbs} />
          </Space>
          <Space size={12}>
            <Input prefix={<SearchOutlined />} placeholder={t('search')} style={{ width: md ? 260 : 160 }} />
            <Space size={4}>
              <SunOutlined />
              <Switch checked={darkMode} onChange={() => dispatch(toggleDarkMode())} checkedChildren={<MoonOutlined />} />
            </Space>
            <Button
              type="text"
              icon={<GlobalOutlined />}
              onClick={() => {
                const next = i18n.language.startsWith('zh') ? 'en-US' : 'zh-CN'
                i18n.changeLanguage(next)
                dispatch(setLanguage(next))
              }}
            />
            <Dropdown menu={{ items: userMenu }}>
              <Space>
                <Avatar icon={<UserOutlined />} src={profile?.avatar} />
                {md && <Typography.Text>{profile?.nickname ?? 'Admin'}</Typography.Text>}
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={contentStyle}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout
