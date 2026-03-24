export const STORAGE_KEYS = {
  token: 'admin:token',
  refreshToken: 'admin:refresh-token',
  expiresAt: 'admin:expires-at',
  profile: 'admin:profile',
  preferences: 'admin:preferences',
}

export const storage = {
  get<T>(key: string): T | null {
    const value = localStorage.getItem(key)
    if (!value) {
      return null
    }
    return JSON.parse(value) as T
  },
  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value))
  },
  remove(key: string): void {
    localStorage.removeItem(key)
  },
}
