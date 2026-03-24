import { CSSProperties } from 'react'

export const layoutStyle: CSSProperties = {
  minHeight: '100vh',
}

export const siderStyle: CSSProperties = {
  borderRight: '1px solid var(--border-color)',
  boxShadow: '0 4px 18px var(--shadow-color)',
}

export const siderLogoStyle: CSSProperties = {
  height: 64,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '0 16px',
  borderBottom: '1px solid var(--border-color)',
}

export const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
  borderBottom: '1px solid var(--border-color)',
  background: 'var(--surface-bg)',
}

export const contentStyle: CSSProperties = {
  margin: 16,
  padding: 16,
  minHeight: 280,
  background: 'transparent',
}
