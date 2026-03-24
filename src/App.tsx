import { App as AntdApp, ConfigProvider, theme as antdTheme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { useAppSelector } from '@/stores/hooks'

function App() {
  const { i18n } = useTranslation()
  const { darkMode, primaryColor } = useAppSelector((state) => state.preferences)
  const locale = i18n.language.startsWith('zh') ? zhCN : enUS
  const algorithm = darkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm
  const currentTheme = useMemo(
    () => ({
      algorithm,
      token: {
        colorPrimary: primaryColor,
        borderRadius: 8,
        boxShadowSecondary: darkMode ? '0 10px 25px rgba(0, 0, 0, 0.35)' : '0 10px 25px rgba(0, 0, 0, 0.08)',
      },
    }),
    [algorithm, darkMode, primaryColor],
  )

  return (
    <ConfigProvider locale={locale} theme={currentTheme}>
      <AntdApp>
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
