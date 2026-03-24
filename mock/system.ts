import dayjs from 'dayjs'
import { MockMethod } from 'vite-plugin-mock'

const users = Array.from({ length: 52 }).map((_, index) => ({
  id: String(index + 1),
  username: `user_${index + 1}`,
  nickname: `用户${index + 1}`,
  role: index % 3 === 0 ? 'admin' : index % 3 === 1 ? 'editor' : 'viewer',
  status: index % 2 === 0 ? 'enabled' : 'disabled',
  updatedAt: dayjs().subtract(index, 'day').format('YYYY-MM-DD HH:mm:ss'),
}))

export default [
  {
    url: '/api/system/users',
    method: 'get',
    response: ({ query }) => {
      const current = Number(query.current ?? 1)
      const pageSize = Number(query.pageSize ?? 10)
      const start = (current - 1) * pageSize
      const list = users.slice(start, start + pageSize)
      return {
        code: 0,
        msg: 'ok',
        data: {
          list,
          total: users.length,
        },
      }
    },
  },
  {
    url: '/api/system/menus',
    method: 'get',
    response: () => ({
      code: 0,
      msg: 'ok',
      data: [
        { key: 'dashboard', label: 'dashboard', path: '/dashboard' },
        { key: 'users', label: 'users', path: '/system/users' },
      ],
    }),
  },
] as MockMethod[]
