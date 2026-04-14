import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns } from '@ant-design/pro-components'
import { Button, DatePicker, Form, Input, Popconfirm, Select, Space, Switch, Tag, message } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useMemo, useRef, useState } from 'react'
import { z } from 'zod'
import FormDrawer from '@/components/FormDrawer'
import Permission from '@/components/Permission'
import ProTableWrapper from '@/components/ProTableWrapper'
import { UserRow, useCreateUserMutation, useDeleteUserMutation, useLazyGetUserByIdQuery, useLazyGetUsersQuery, useUpdateUserMutation } from '@/services/api/baseApi'

const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().max(100),
  password: z.string().min(6).max(100),
  phoneNumber: z.string().max(30).optional(),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  gender: z.string().max(20).optional(),
  dateOfBirth: z.custom<Dayjs>().optional(),
  avatar: z.string().max(300).optional(),
  bio: z.string().max(500).optional(),
  address: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  zipCode: z.string().max(20).optional(),
  country: z.string().max(100).optional(),
  isActive: z.boolean().optional(),
})

type CreateUserForm = z.infer<typeof createUserSchema>

const updateUserSchema = createUserSchema.extend({
  password: z.string().max(100).optional(),
})

type UpdateUserForm = z.infer<typeof updateUserSchema>

function UsersPage() {
  const [open, setOpen] = useState(false)
  const [refreshSeed, setRefreshSeed] = useState(0)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form] = Form.useForm<CreateUserForm | UpdateUserForm>()
  const actionRef = useRef<ActionType>()
  const [trigger] = useLazyGetUsersQuery()
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation()
  const [getUserById] = useLazyGetUserByIdQuery()
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
  const [deleteUser] = useDeleteUserMutation()
  const columns = useMemo<ProColumns<UserRow>[]>(
    () => [
      { title: '用户名', dataIndex: 'username', ellipsis: true },
      { title: '邮箱', dataIndex: 'email', ellipsis: true },
      { title: '手机号', dataIndex: 'phoneNumber', ellipsis: true },
      {
        title: '启用',
        dataIndex: 'isActive',
        valueType: 'select',
        valueEnum: {
          true: { text: '启用', status: 'Success' },
          false: { text: '禁用', status: 'Default' },
        },
        render: (_, row) => <Tag color={row.isActive === false ? 'default' : 'success'}>{row.isActive === false ? '禁用' : '启用'}</Tag>,
      },
      { title: '创建时间', dataIndex: 'createdAt', valueType: 'date' },
      {
        title: '操作',
        valueType: 'option',
        render: (_, row) => [
          <Permission key="edit" code="user:update">
            <a
              onClick={async () => {
                setEditingId(row.id)
                const detail = await getUserById({ userId: row.id }).unwrap().then((res) => {
                  console.log(res,3456789)
                 return res
                })
                form.resetFields()
                form.setFieldsValue({
                  username: detail.username,
                  email: detail.email,
                  password: '',
                  phoneNumber: detail.phoneNumber,
                  firstName: detail.firstName,
                  lastName: detail.lastName,
                  gender: detail.gender,
                  dateOfBirth: detail.dateOfBirth ? dayjs(detail.dateOfBirth) : undefined,
                  avatar: detail.avatar,
                  bio: detail.bio,
                  address: detail.address,
                  city: detail.city,
                  state: detail.state,
                  zipCode: detail.zipCode,
                  country: detail.country,
                  isActive: detail.isActive ?? true,
                })
                console.log(detail, form.getFieldsValue())
                setOpen(true)
              }}
            >
              编辑
            </a>
          </Permission>,
          <Permission key="delete" code="user:delete">
            <Popconfirm
              title="确认删除该用户？"
              okText="删除"
              cancelText="取消"
              onConfirm={async () => {
                await deleteUser({ userId: row.id }).unwrap()
                message.success('删除成功')
                setRefreshSeed((s) => s + 1)
                actionRef.current?.reload()
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </Permission>,
        ],
      },
    ],
    [deleteUser, form, getUserById],
  )

  return (
    <>
      <ProTableWrapper<UserRow>
        title="用户列表"
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        params={{ refreshSeed }}
        request={async (params, sort, filter) => {
          const { current, pageSize, ...rest } = params
          const query = Object.fromEntries(
            Object.entries(rest).filter(([, value]) => value !== undefined && value !== null && value !== ''),
          )
          try {
            const result = await trigger({
              pageNumber: Number(current ?? 1),
              pageSize: Number(pageSize ?? 10),
              ...query,
              ...(sort && Object.keys(sort).length ? { sort } : {}),
              ...(filter && Object.keys(filter).length ? { filter } : {}),
            }).unwrap()
            return { data: result.list, total: result.total, success: true }
          } catch {
            return { data: [], total: 0, success: false }
          }
        }}
        toolBarRender={() => [
          <Space key="toolbar">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingId(null)
                form.resetFields()
                form.setFieldsValue({ isActive: true, password: '' })
                setOpen(true)
              }}
            >
              新增
            </Button>
          </Space>,
        ]}
      />
      <FormDrawer
        open={open}
        title={editingId ? '编辑用户' : '新增用户'}
        confirmLoading={isCreating || isUpdating}
        onClose={() => {
          setOpen(false)
          setEditingId(null)
        }}
        onSubmit={async () => {
          const values = await form.validateFields()
          const normalized: CreateUserForm | UpdateUserForm = {
            ...values,
            username: String(values.username ?? '').trim(),
            email: String(values.email ?? '').trim(),
            password: values.password ? String(values.password) : '',
            phoneNumber: values.phoneNumber ? String(values.phoneNumber).trim() : undefined,
            firstName: values.firstName ? String(values.firstName).trim() : undefined,
            lastName: values.lastName ? String(values.lastName).trim() : undefined,
            gender: values.gender ? String(values.gender).trim() : undefined,
            avatar: values.avatar ? String(values.avatar).trim() : undefined,
            bio: values.bio ? String(values.bio).trim() : undefined,
            address: values.address ? String(values.address).trim() : undefined,
            city: values.city ? String(values.city).trim() : undefined,
            state: values.state ? String(values.state).trim() : undefined,
            zipCode: values.zipCode ? String(values.zipCode).trim() : undefined,
            country: values.country ? String(values.country).trim() : undefined,
            isActive: values.isActive ?? true,
            dateOfBirth: values.dateOfBirth,
          }

          const schema = editingId ? updateUserSchema : createUserSchema
          const parsed = schema.parse(normalized)
          const payload: Record<string, unknown> = {
            Username: parsed.username,
            Email: parsed.email,
            PhoneNumber: parsed.phoneNumber,
            FirstName: parsed.firstName,
            LastName: parsed.lastName,
            Gender: parsed.gender,
            DateOfBirth: parsed.dateOfBirth ? dayjs(parsed.dateOfBirth).format('YYYY-MM-DD') : undefined,
            Avatar: parsed.avatar,
            Bio: parsed.bio,
            Address: parsed.address,
            City: parsed.city,
            State: parsed.state,
            ZipCode: parsed.zipCode,
            Country: parsed.country,
            IsActive: parsed.isActive,
          }

          if (!editingId) {
            payload.Password = (parsed as CreateUserForm).password
            await createUser(payload).unwrap()
            message.success('创建成功')
          } else {
            const password = (parsed as UpdateUserForm).password
            if (password) {
              payload.Password = password
            }
            await updateUser({ userId: editingId, ...payload }).unwrap()
            message.success('更新成功')
          }
          setOpen(false)
          setEditingId(null)
          setRefreshSeed((s) => s + 1)
          actionRef.current?.reload()
        }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input maxLength={50} />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: !editingId }]}>
            <Input.Password maxLength={100} />
          </Form.Item>
          <Form.Item name="phoneNumber" label="手机号">
            <Input maxLength={30} />
          </Form.Item>
          <Form.Item name="firstName" label="FirstName">
            <Input maxLength={50} />
          </Form.Item>
          <Form.Item name="lastName" label="LastName">
            <Input maxLength={50} />
          </Form.Item>
          <Form.Item name="gender" label="性别">
            <Select
              allowClear
              options={[
                { value: 'male', label: '男' },
                { value: 'female', label: '女' },
                { value: 'other', label: '其他' },
              ]}
            />
          </Form.Item>
          <Form.Item name="dateOfBirth" label="生日">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="avatar" label="头像">
            <Input maxLength={300} />
          </Form.Item>
          <Form.Item name="bio" label="简介">
            <Input.TextArea maxLength={500} rows={3} />
          </Form.Item>
          <Form.Item name="address" label="地址">
            <Input maxLength={200} />
          </Form.Item>
          <Form.Item name="city" label="城市">
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item name="state" label="州/省">
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item name="zipCode" label="邮编">
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item name="country" label="国家">
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item name="isActive" label="启用" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </FormDrawer>
    </>
  )
}

export default UsersPage
