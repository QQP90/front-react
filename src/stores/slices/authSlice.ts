import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthTokens, MenuNode, UserProfile } from '@/types/auth'
import { STORAGE_KEYS, storage } from '@/utils/storage'

interface AuthState {
  tokens: AuthTokens | null
  user: UserProfile | null
  routes: MenuNode[]
}

const getInitialState = (): AuthState => ({
  tokens: storage.get<AuthTokens>(STORAGE_KEYS.token),
  user: storage.get<UserProfile>(STORAGE_KEYS.profile),
  routes: [],
})

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setSession: (state, action: PayloadAction<{ tokens: AuthTokens; user: UserProfile; routes: MenuNode[] }>) => {
      state.tokens = action.payload.tokens
      state.user = action.payload.user
      state.routes = action.payload.routes
      storage.set(STORAGE_KEYS.token, action.payload.tokens)
      storage.set(STORAGE_KEYS.profile, action.payload.user)
    },
    updateTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.tokens = action.payload
      storage.set(STORAGE_KEYS.token, action.payload)
    },
    clearSession: (state) => {
      state.tokens = null
      state.user = null
      state.routes = []
      storage.remove(STORAGE_KEYS.token)
      storage.remove(STORAGE_KEYS.profile)
    },
    setRoutes: (state, action: PayloadAction<MenuNode[]>) => {
      state.routes = action.payload
    },
  },
})

export const { setSession, updateTokens, clearSession, setRoutes } = authSlice.actions
export default authSlice.reducer
