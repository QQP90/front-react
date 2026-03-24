import { Card, Tree } from 'antd'
import { DataNode } from 'antd/es/tree'
import { staticMenus } from '@/router/routes'

const toTreeData = (nodes: typeof staticMenus): DataNode[] =>
  nodes.map((node) => ({
    title: node.label,
    key: node.key,
    children: node.children ? toTreeData(node.children) : undefined,
  }))

function MenusPage() {
  return (
    <Card className="page-card" title="菜单管理">
      <Tree treeData={toTreeData(staticMenus)} defaultExpandAll />
    </Card>
  )
}

export default MenusPage
