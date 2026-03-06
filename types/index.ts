// 环境变量类型
export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test'
  NEXT_PUBLIC_THEME: string
  NEXT_PUBLIC_LANG: string
  NOTION_PAGE_ID: string
  REDIS_URL?: string
  UPSTASH_REDIS_REST_URL?: string
  UPSTASH_REDIS_REST_TOKEN?: string
  KV_REST_API_URL?: string
  KV_REST_API_TOKEN?: string
  VERCEL_ENV?: string
  ANALYZE?: string
}

// 导出所有类型
// export * from './blog'
// export * from './notion'
// export * from './theme'
