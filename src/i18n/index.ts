import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import enUS from '@/i18n/locales/en-US/common'
import zhCN from '@/i18n/locales/zh-CN/common'
import { store } from '@/stores'

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources: {
    'zh-CN': { translation: zhCN },
    'en-US': { translation: enUS },
  },
  lng: store.getState().preferences.language,
  fallbackLng: 'zh-CN',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
