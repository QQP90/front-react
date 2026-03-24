import { InboxOutlined } from '@ant-design/icons'
import { Progress, Upload } from 'antd'
import { useState } from 'react'
import { chunkSize } from './styles'
import { ChunkUploadProps } from './types'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function ChunkUpload({ maxCount = 3 }: ChunkUploadProps) {
  const [percent, setPercent] = useState(0)

  return (
    <>
      <Upload.Dragger
        name="file"
        multiple
        maxCount={maxCount}
        customRequest={async ({ file, onSuccess }) => {
          const current = file as File
          const total = Math.ceil(current.size / chunkSize)
          for (let index = 0; index < total; index += 1) {
            await sleep(150)
            setPercent(Math.round(((index + 1) / total) * 100))
          }
          onSuccess?.(current)
        }}
      >
        <p>
          <InboxOutlined />
        </p>
        <p>支持拖拽、多文件与切片上传</p>
      </Upload.Dragger>
      <Progress percent={percent} />
    </>
  )
}

export default ChunkUpload
