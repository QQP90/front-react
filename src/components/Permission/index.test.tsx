import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import Permission from '@/components/Permission'
import { store } from '@/stores'

describe('Permission', () => {
  it('renders fallback without permission', () => {
    render(
      <Provider store={store}>
        <Permission code="any:view" fallback={<span>hidden</span>}>
          <span>show</span>
        </Permission>
      </Provider>,
    )
    expect(screen.getByText('hidden')).toBeInTheDocument()
  })
})
