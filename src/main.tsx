import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App'
import '@/i18n'
import { store } from '@/stores'

const RootApp = (
  <Provider store={store}>
    <App />
  </Provider>
)

createRoot(document.getElementById('root')!).render(
  import.meta.env.DEV ? RootApp : <StrictMode>{RootApp}</StrictMode>,
)
