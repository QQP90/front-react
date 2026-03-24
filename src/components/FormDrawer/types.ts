import { ReactNode } from 'react'

export interface FormDrawerProps {
  open: boolean
  title: string
  width?: number
  onClose: () => void
  onSubmit: () => void
  children: ReactNode
}
