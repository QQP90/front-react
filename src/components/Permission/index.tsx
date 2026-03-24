import { PermissionProps } from './types'
import { useAppSelector } from '@/stores/hooks'

function Permission({ code, fallback = null, children }: PermissionProps) {
  const permissions = useAppSelector((state) => state.auth.user?.permissions ?? [])
  if (!permissions.includes(code)) {
    return <>{fallback}</>
  }
  return <>{children}</>
}

export default Permission
