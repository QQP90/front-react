import path from 'node:path'
import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import { viteMockServe } from 'vite-plugin-mock'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const useCDN = mode === 'production' && env.VITE_USE_CDN === 'true'
  const proxyTarget = env.VITE_API_PROXY_TARGET
  console.log(proxyTarget,45678)
  const enableMock = env.VITE_USE_MOCK !== 'false' && !proxyTarget
  return {
    define: {
      __API_BASE_URL__: JSON.stringify(env.VITE_API_BASE_URL || '/api'),
    },
    server: proxyTarget
      ? {
          proxy: {
            '/api': {
              target: proxyTarget,
              changeOrigin: true,
              secure: false,
            },
            '/swagger': {
              target: proxyTarget,
              changeOrigin: true,
              secure: false,
            },
            '/swagger-ui': {
              target: proxyTarget,
              changeOrigin: true,
              secure: false,
            },
          },
        }
      : undefined,
    plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    viteMockServe({
      mockPath: 'mock',
      enable: enableMock,
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      deleteOriginFile: false,
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      deleteOriginFile: false,
    }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            '@primary-color': '#1677ff',
            '@border-radius-base': '8px',
          },
        },
      },
    },
    build: {
      target: 'es2018',
      sourcemap: true,
      rollupOptions: {
        external: useCDN ? ['react', 'react-dom'] : [],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
          manualChunks: (id: string) => {
            if (id.includes('react-router-dom') || id.includes('react-dom') || id.includes('/react/')) {
              return 'react'
            }
            if (id.includes('antd') || id.includes('@ant-design')) {
              return 'antd'
            }
            if (id.includes('@reduxjs') || id.includes('react-redux')) {
              return 'state'
            }
            if (id.includes('echarts')) {
              return 'chart'
            }
            return undefined
          },
        },
      },
    },
  }
})
