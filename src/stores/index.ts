import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { baseApi } from '@/services/api/baseApi'
import { configureHttpAuthBridge } from '@/services/http'
import authReducer from '@/stores/slices/authSlice'
import preferencesReducer from '@/stores/slices/preferencesSlice'
import { clearSession, updateTokens } from '@/stores/slices/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    preferences: preferencesReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

configureHttpAuthBridge({
  getAuthState: () => ({
    accessToken: store.getState().auth.tokens?.accessToken,
    refreshToken: store.getState().auth.tokens?.refreshToken,
  }),
  onTokenRefresh: (tokens) => {
    store.dispatch(updateTokens(tokens))
  },
  onUnauthorized: () => {
    store.dispatch(clearSession())
  },
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
