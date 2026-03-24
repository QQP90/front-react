import { MenuProps } from 'antd'

export interface HeaderAction {
  key: string
  label: string
  onClick: () => void
}

export interface FlatMenuItem {
  key: string
  label: string
  path: string
}

export type SidebarMenuItem = Required<MenuProps>['items'][number]
