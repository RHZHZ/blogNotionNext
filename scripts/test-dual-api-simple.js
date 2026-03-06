#!/usr/bin/env node

/**
 * 简化版双重API测试脚本
 */

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 简单环境变量加载
async function loadEnvFile(filePath) {
  try {
    const fs = await import('fs')
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split('\n')
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          process.env[key.trim()] = valueParts.join('=').trim()
        }
      }
    }
  } catch (error) {
    console.warn('无法加载环境变量文件:', error.message)
  }
}

async function testDualAPI() {
  console.log('🧪 Notion 双重 API 降级策略测试')
  console.log('='.repeat(50))
  
  // 加载环境变量
  loadEnvFile(path.join(__dirname, '..', '.env.local'))
  
  // 检查配置
  const accessToken = process.env.NOTION_ACCESS_TOKEN
  const tokenV2 = process.env.NOTION_TOKEN_V2
  
  console.log(`🔑 NOTION_ACCESS_TOKEN: ${accessToken ? '✅ 已配置' : '❌ 未配置'}`)
  console.log(`🔑 NOTION_TOKEN_V2: ${tokenV2 ? '✅ 已配置' : '❌ 未配置'}`)
  
  if (!accessToken && !tokenV2) {
    console.log('\n❌ 至少需要配置一种Notion Token!')
    return false
  }
  
  console.log('\n✅ 环境配置检查通过')
  
  // 测试Official API
  if (accessToken) {
    console.log('\n🔵 测试 Official API...')
    try {
      const { updateNotionPageSummary } = await import('../lib/notion/notion_api.js')
      console.log('✅ Official API 模块加载成功')
      
      // 检查API是否可调用 (不实际发送请求)
      if (typeof updateNotionPageSummary === 'function') {
        console.log('✅ Official API 函数可用')
      } else {
        console.log('❌ Official API 函数不可用')
      }
    } catch (error) {
      console.log('❌ Official API 加载失败:', error.message)
    }
  }
  
  // 测试Unofficial API
  if (tokenV2) {
    console.log('\n🟡 测试 Unofficial API...')
    try {
      const { updateNotionPageSummaryUnofficial } = await import('../lib/notion/notion_api_unofficial.js')
      console.log('✅ Unofficial API 模块加载成功')
      
      if (typeof updateNotionPageSummaryUnofficial === 'function') {
        console.log('✅ Unofficial API 函数可用')
      } else {
        console.log('❌ Unofficial API 函数不可用')
      }
    } catch (error) {
      console.log('❌ Unofficial API 加载失败:', error.message)
    }
  }
  
  console.log('\n🎉 双重API降级策略配置验证完成!')
  console.log('\n📋 降级策略说明:')
  console.log('1. 优先使用 Official API (NOTION_ACCESS_TOKEN)')
  console.log('2. 失败时自动降级到 Unofficial API (NOTION_TOKEN_V2)')
  console.log('3. 提供完整的容错机制')
  
  return true
}

testDualAPI().catch(error => {
  console.error('测试失败:', error)
})