import { ReactNode } from 'react'

export interface PermissionProps {
  code: string
  fallback?: ReactNode
  children: ReactNode
}
