import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { STORAGE_KEYS, storage } from '@/utils/storage'

interface PreferencesState {
  darkMode: boolean
  language: 'zh-CN' | 'en-US'
  sidebarCollapsed: boolean
  primaryColor: string
}

const defaults: PreferencesState = {
  darkMode: false,
  language: 'zh-CN',
  sidebarCollapsed: false,
  primaryColor: '#1677ff',
}

const getInitialState = (): PreferencesState => ({
  ...defaults,
  ...storage.get<PreferencesState>(STORAGE_KEYS.preferences),
})

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: getInitialState(),
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      storage.set(STORAGE_KEYS.preferences, state)
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
      storage.set(STORAGE_KEYS.preferences, state)
    },
    setLanguage: (state, action: PayloadAction<'zh-CN' | 'en-US'>) => {
      state.language = action.payload
      storage.set(STORAGE_KEYS.preferences, state)
    },
  },
})

export const { toggleDarkMode, setSidebarCollapsed, setLanguage } = preferencesSlice.actions
export default preferencesSlice.reducer
