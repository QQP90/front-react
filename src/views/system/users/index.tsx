import { PlusOutlined } from '@ant-design/icons'
import { ProColumns } from '@ant-design/pro-components'
import { Button, Form, Input, Select, Space, Tag } from 'antd'
import { useMemo, useState } from 'react'
import { z } from 'zod'
import ChunkUpload from '@/components/ChunkUpload'
import FormDrawer from '@/components/FormDrawer'
import Permission from '@/components/Permission'
import ProTableWrapper from '@/components/ProTableWrapper'
import { UserRow, useLazyGetUsersQuery } from '@/services/api/baseApi'

const userSchema = z.object({
  username: z.string().min(3),
  nickname: z.string().min(2),
  role: z.string().min(1),
})

function UsersPage() {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const [trigger] = useLazyGetUsersQuery()
  const columns = useMemo<ProColumns<UserRow>[]>(
    () => [
      { title: '用户名', dataIndex: 'username', ellipsis: true },
      { title: '昵称', dataIndex: 'nickname' },
      { title: '角色', dataIndex: 'role', render: (_, row) => <Tag color="blue">{row.role}</Tag> },
      {
        title: '状态',
        dataIndex: 'status',
        valueType: 'select',
        valueEnum: {
          enabled: { text: '启用', status: 'Success' },
          disabled: { text: '禁用', status: 'Default' },
        },
      },
      { title: '更新时间', dataIndex: 'updatedAt', valueType: 'dateTime' },
      {
        title: '操作',
        valueType: 'option',
        render: () => [
          <a key="edit">编辑</a>,
          <Permission key="delete" code="user:delete">
            <a>删除</a>
          </Permission>,
        ],
      },
    ],
    [],
  )

  return (
    <>
      <ProTableWrapper<UserRow>
        title="用户列表"
        rowKey="id"
        columns={columns}
        request={async (params, sort, filter) => {
          const { pageNumber, pageSize, ...rest } = params
          const query = Object.fromEntries(
            Object.entries(rest).filter(([, value]) => value !== undefined && value !== null && value !== ''),
          )
          delete query.current
          try {
            const result = await trigger({
              pageNumber: Number(pageNumber ?? 1),  
              pageSize: Number(pageSize ?? 10),
              ...query,
              ...(sort && Object.keys(sort).length ? { sort } : {}),
              ...(filter && Object.keys(filter).length ? { filter } : {}),
            }).unwrap()
            console.log(result,9988)
            return { data: result.list, total: result.total, success: true }
          } catch {
            return { data: [], total: 0, success: false }
          }
        }}
        toolBarRender={() => [
          <Space key="toolbar">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
              新增
            </Button>
          </Space>,
        ]}
      />
      <FormDrawer
        open={open}
        title="新增用户"
        onClose={() => setOpen(false)}
        onSubmit={async () => {
          const values = await form.validateFields()
          userSchema.parse(values)
          setOpen(false)
        }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="nickname"
            label="昵称"
            rules={[
              { required: true },
              {
                validator: async (_, value) => {
                  await new Promise((resolve) => setTimeout(resolve, 200))
                  if (!value || value.length < 2) {
                    throw new Error('昵称长度至少2位')
                  }
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Select options={[{ value: 'admin' }, { value: 'editor' }, { value: 'viewer' }]} />
          </Form.Item>
          <ChunkUpload />
        </Form>
      </FormDrawer>
    </>
  )
}

export default UsersPage
