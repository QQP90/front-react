import { Card, List, Switch } from 'antd'

const roles = [
  { name: 'admin', desc: '全量管理权限' },
  { name: 'editor', desc: '内容与数据维护' },
  { name: 'viewer', desc: '只读查看权限' },
]

function RolesPage() {
  return (
    <Card className="page-card" title="角色权限">
      <List
        dataSource={roles}
        renderItem={(item) => (
          <List.Item actions={[<Switch key="switch" defaultChecked={item.name !== 'viewer'} />]}>
            <List.Item.Meta title={item.name} description={item.desc} />
          </List.Item>
        )}
      />
    </Card>
  )
}

export default RolesPage
