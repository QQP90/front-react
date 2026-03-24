import { render, screen } from '@testing-library/react'
import FormDrawer from '@/components/FormDrawer'

describe('FormDrawer', () => {
  it('renders title', () => {
    render(
      <FormDrawer open title="新增用户" onClose={() => undefined} onSubmit={() => undefined}>
        content
      </FormDrawer>,
    )
    expect(screen.getByText('新增用户')).toBeInTheDocument()
  })
})
