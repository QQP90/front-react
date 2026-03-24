import { render, screen } from '@testing-library/react'
import ChunkUpload from '@/components/ChunkUpload'

describe('ChunkUpload', () => {
  it('renders upload hint', () => {
    render(<ChunkUpload />)
    expect(screen.getByText('支持拖拽、多文件与切片上传')).toBeInTheDocument()
  })
})
