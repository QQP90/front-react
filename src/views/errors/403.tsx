import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

function ForbiddenPage() {
  const navigate = useNavigate()
  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，您无权访问当前资源。"
      extra={
        <Button type="primary" onClick={() => navigate('/dashboard')}>
          返回首页
        </Button>
      }
    />
  )
}

export default ForbiddenPage
