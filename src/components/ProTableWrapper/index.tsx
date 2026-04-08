import { ProTable } from '@ant-design/pro-components'
import { ProTableWrapperProps } from './types'
import { defaultPagination } from './styles'

function ProTableWrapper<T extends object>(props: ProTableWrapperProps<T>) {
  const { columns, title, request, rowKey, toolBarRender, actionRef, params } = props
  return (
    <ProTable<T>
      rowKey={rowKey}
      cardBordered
      columns={columns}
      request={request}
      actionRef={actionRef}
      params={params}
      headerTitle={title}
      search={{ labelWidth: 'auto' }}
      pagination={defaultPagination}
      options={{ density: true, setting: true, fullScreen: true, reload: true }}
      rowSelection={{}}
      toolBarRender={toolBarRender}
    />
  )
}

export default ProTableWrapper
