import { Button, Drawer, Space } from 'antd'
import { FormDrawerProps } from './types'
import { drawerWidth } from './styles'

function FormDrawer({ open, title, width, onClose, onSubmit, children }: FormDrawerProps) {
  return (
    <Drawer
      open={open}
      title={title}
      width={width ?? drawerWidth}
      onClose={onClose}
      destroyOnClose
      extra={
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={onSubmit}>
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
