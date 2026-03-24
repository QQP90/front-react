# 企业级响应式后台管理系统

基于 React 18 + TypeScript + Ant Design + Vite 构建，内置 RBAC 权限、动态路由、主题切换、国际化、RTK Query、Mock、测试与工程化能力。

## 环境要求

- Node.js >= 20
- npm >= 10

## 快速启动

```bash
npm install
npm run dev
```

打开 `http://127.0.0.1:5173`。

## 常用命令

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run test:coverage
npm run build
npm run e2e
```

## 环境变量

复制 `.env.example` 为 `.env` 后可配置：

- `VITE_API_BASE_URL`：接口前缀，默认 `/api`

## Docker

```bash
docker compose up -d --build
```

启动后访问 `http://127.0.0.1:8080`。
