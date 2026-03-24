import { ProColumns, ProTableProps } from '@ant-design/pro-components'

export interface ProTableWrapperProps<T extends object>
  extends Pick<ProTableProps<T, Record<string, unknown>>, 'request' | 'rowKey' | 'toolBarRender'> {
  columns: ProColumns<T>[]
  title: string
}
