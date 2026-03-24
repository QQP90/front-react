import { LockOutlined, SafetyCertificateOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Form, Input, Row, Col, Typography } from 'antd'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useLoginMutation } from '@/services/api/baseApi'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { setSession } from '@/stores/slices/authSlice'

const schema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  captcha: z.string().min(4),
  remember: z.boolean(),
})

type LoginForm = z.infer<typeof schema>

function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)
  const [login, { isLoading }] = useLoginMutation()
  const { handleSubmit, control } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: 'admin',
      password: 'Admin123!',
      captcha: '1234',
      remember: true,
    },
  })

  useEffect(() => {
    if (auth.tokens) {
      navigate('/dashboard', { replace: true })
    }
  }, [auth.tokens, navigate])

  const onSubmit = async (values: LoginForm) => {
    const data = await login(values).unwrap()
    dispatch(setSession(data))
    navigate('/dashboard', { replace: true })
  }

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', padding: 16 }}>
      <Col xs={24} sm={18} md={12} lg={8}>
        <Card className="page-card">
          <Typography.Title level={3} style={{ textAlign: 'center' }}>
            {t('login')}
          </Typography.Title>
          <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name="username"
              render={({ field, fieldState }) => (
                <Form.Item label={t('username')} validateStatus={fieldState.error ? 'error' : undefined}>
                  <Input {...field} prefix={<UserOutlined />} autoFocus />
                </Form.Item>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <Form.Item label={t('password')} validateStatus={fieldState.error ? 'error' : undefined}>
                  <Input.Password {...field} prefix={<LockOutlined />} />
                </Form.Item>
              )}
            />
            <Controller
              control={control}
              name="captcha"
              render={({ field, fieldState }) => (
                <Form.Item label={t('captcha')} validateStatus={fieldState.error ? 'error' : undefined}>
                  <Input {...field} prefix={<SafetyCertificateOutlined />} />
                </Form.Item>
              )}
            />
            <Controller
              control={control}
              name="remember"
              render={({ field }) => (
                <Form.Item>
                  <Checkbox checked={field.value} onChange={field.onChange}>
                    记住我
                  </Checkbox>
                </Form.Item>
              )}
            />
            <Button block type="primary" htmlType="submit" loading={isLoading}>
              {t('login')}
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  )
}

export default LoginPage
