import { Button, Drawer, Space } from 'antd'
import { FormDrawerProps } from './types'
import { drawerWidth } from './styles'

function FormDrawer({ open, title, width, confirmLoading, onClose, onSubmit, children }: FormDrawerProps) {
  return (
    <Drawer
      open={open}
      title={title}
      width={width ?? drawerWidth}
      onClose={onClose}
      destroyOnClose
      extra={
        <Space>
          <Button onClick={onClose} disabled={confirmLoading}>
            取消
          </Button>
          <Button type="primary" onClick={onSubmit} loading={confirmLoading}>
            提交
          </Button>
        </Space>
      }
    >
      {children}
    </Drawer>
  )
}

export default FormDrawer
