import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns } from '@ant-design/pro-components'
import { Button, Form, Input, InputNumber, Popconfirm, Space, message } from 'antd'
import dayjs from 'dayjs'
import { useMemo, useRef, useState } from 'react'
import { z } from 'zod'
import FormDrawer from '@/components/FormDrawer'
import Permission from '@/components/Permission'
import ProTableWrapper from '@/components/ProTableWrapper'
import {
  OrderRow,
  useCreateOrderMutation,
  useDeleteOrderMutation,
  useLazyGetOrdersQuery,
  useUpdateOrderMutation,
} from '@/services/api/baseApi'

const orderSchema = z.object({
  name: z.string().min(1),
  totalPrice: z.number().nonnegative(),
})

type OrderForm = z.infer<typeof orderSchema>

function OrdersPage() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<OrderRow | null>(null)
  const [refreshSeed, setRefreshSeed] = useState(0)
  const [form] = Form.useForm<OrderForm>()
  const actionRef = useRef<ActionType>()

  const [trigger] = useLazyGetOrdersQuery()
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation()
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation()
  const [deleteOrder] = useDeleteOrderMutation()

  const columns = useMemo<ProColumns<OrderRow>[]>(
    () => [
      { title: '名称', dataIndex: 'name', ellipsis: true },
      { title: '金额', dataIndex: 'totalPrice', valueType: 'money' },

      { title: '创建时间', dataIndex: 'createdAt', valueType: 'date' },
      {
        title: '操作',
        valueType: 'option',
        render: (_, row) => [
          <Permission key="edit" code="order:update">
            <a
              onClick={() => {
                setEditing(row)
                form.setFieldsValue({
                  name: row.name,

                  totalPrice: row.totalPrice,
                })
                setOpen(true)
              }}
            >
              编辑
            </a>
          </Permission>,
          <Permission key="delete" code="order:delete">
            <Popconfirm
              title="确认删除该订单？"
              okText="删除"
              cancelText="取消"
              onConfirm={async () => {
                await deleteOrder({ orderId: row.orderId }).unwrap()
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
    [deleteOrder, form],
  )

  const onCreate = () => {
    setEditing(null)
    form.resetFields()
    form.setFieldsValue({ totalPrice: 0 })
    setOpen(true)
  }

  const onSubmit = async () => {
    const values = await form.validateFields()
    console.log(values)
    const parsed = orderSchema.parse({
      ...values,
     
      totalPrice: Number(values.totalPrice ?? 0),
    })
console.log(parsed)
    if (editing) {
      await updateOrder({ orderId: editing.orderId, ...parsed, orderDate: dayjs().format('YYYY-MM-DD') }).unwrap()
      message.success('更新成功')
    } else {
      await createOrder(parsed).unwrap()
      message.success('创建成功')
    }

    setOpen(false)
    setEditing(null)
    setRefreshSeed((s) => s + 1)
    actionRef.current?.reload()
  }

  return (
    <>
      <ProTableWrapper<OrderRow>
        title="订单列表"
        rowKey="orderId"
        columns={columns}
        actionRef={actionRef}
        params={{ refreshSeed }}
        request={async (params, sort, filter) => {
          const { current, pageSize, ...rest } = params
          const query = Object.fromEntries(
            Object.entries(rest).filter(([, value]) => value !== undefined && value !== null && value !== ''),
          )
          const result = await trigger({
            pageNumber: Number(current ?? 1),
            pageSize: Number(pageSize ?? 10),
            ...query,
            ...(sort && Object.keys(sort).length ? { sort } : {}),
            ...(filter && Object.keys(filter).length ? { filter } : {}),
          }).unwrap()
          return { data: result.list, total: result.total, success: true }
        }}
        toolBarRender={() => [
          <Space key="toolbar">
            <Permission code="order:create">
              <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
                新增
              </Button>
            </Permission>
          </Space>,
        ]}
      />
      <FormDrawer
        open={open}
        title={editing ? '编辑订单' : '新增订单'}
        confirmLoading={isCreating || isUpdating}
        onClose={() => {
          setOpen(false)
          setEditing(null)
        }}
        onSubmit={onSubmit}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="totalPrice" label="金额" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Form>
      </FormDrawer>
    </>
  )
}

export default OrdersPage
