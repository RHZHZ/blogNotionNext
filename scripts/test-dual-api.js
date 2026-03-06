#!/usr/bin/env node

/**
 * 测试双重 API 降级策略
 * 优先使用 Official API (NOTION_ACCESS_TOKEN)
 * 失败时降级到 Unofficial API (NOTION_TOKEN_V2)
 */

import path from 'path'
import { fileURLToPath } from 'url'

// 加载环境变量 (手动读取.env.local)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const fs = await import('fs')

// 简单的环境变量加载
function loadEnvFile(filePath) {
  try {
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
    console.warn('无法加载环境变量文件:', filePath, error.message)
  }
}

loadEnvFile(path.join(__dirname, '..', '.env.local'))

console.log('🧪 测试双重 API 降级策略\n')

// 获取页面ID参数
const pageId = process.argv[2]
if (!pageId) {
  console.log('❌ 请提供页面ID')
  console.log('用法: node test-dual-api.js <pageId>')
  process.exit(1)
}

console.log(`📄 测试页面: ${pageId}`)
console.log(`🔗 测试链接: https://www.notion.so/${pageId.replace(/-/g, '')}\n`)

async function testDualAPI() {
  try {
    // 测试摘要
    const testSummary = `【双重API测试】这是一个通过双重API策略生成的测试摘要。测试时间: ${new Date().toLocaleString()}`
    console.log('📝 测试摘要:', testSummary)
    console.log('')

    // 步骤1: 测试 Official API
    console.log('🔵 步骤 1: 测试 Official API (NOTION_ACCESS_TOKEN)')
    console.log('─'.repeat(50))
    
    try {
      const { updateNotionPageSummary } = await import('../lib/notion/notion_api.js')
      const officialResult = await updateNotionPageSummary(pageId, testSummary + ' [Official API]')
      
      if (officialResult.success) {
        console.log('✅ Official API 测试成功！')
        console.log('🎉 双重API策略工作正常 - 优先使用Official API')
        return true
      } else {
        console.log('❌ Official API 失败:', officialResult.error)
        throw new Error(officialResult.error)
      }
    } catch (officialError) {
      console.log('⚠️ Official API 不可用，错误:', officialError.message)
      
      // 步骤2: 测试 Unofficial API 降级
      console.log('\n🟡 步骤 2: 降级到 Unofficial API (NOTION_TOKEN_V2)')
      console.log('─'.repeat(50))
      
      try {
        const { updateNotionPageSummaryUnofficial } = await import('../lib/notion/notion_api_unofficial.js')
        const unofficialResult = await updateNotionPageSummaryUnofficial(pageId, testSummary + ' [Unofficial API]')
        
        if (unofficialResult.success) {
          console.log('✅ Unofficial API 降级成功！')
          console.log('🎉 双重API策略工作正常 - Official失败时自动降级')
          return true
        } else {
          console.log('❌ Unofficial API 也失败:', unofficialResult.error)
          return false
        }
      } catch (unofficialError) {
        console.log('❌ Unofficial API 降级失败:', unofficialError.message)
        return false
      }
    }
    
  } catch (error) {
    console.error('🚨 测试过程中发生错误:', error)
    return false
  }
}

async function checkEnvironment() {
  console.log('🔧 检查环境配置:')
  console.log('─'.repeat(30))
  
  const accessToken = process.env.NOTION_ACCESS_TOKEN
  const tokenV2 = process.env.NOTION_TOKEN_V2
  
  console.log(`🔑 NOTION_ACCESS_TOKEN: ${accessToken ? '✅ 已配置 (' + accessToken.length + ' 字符)' : '❌ 未配置'}`)
  console.log(`🔑 NOTION_TOKEN_V2: ${tokenV2 ? '✅ 已配置 (' + tokenV2.length + ' 字符)' : '❌ 未配置'}`)
  
  if (!accessToken && !tokenV2) {
    console.log('\n❌ 至少需要配置一种Notion Token!')
    console.log('请在 .env.local 中添加:')
    console.log('NOTION_ACCESS_TOKEN=your_integration_token')
    console.log('# 或')
    console.log('NOTION_TOKEN_V2=your_browser_token')
    return false
  }
  
  console.log('✅ 环境配置检查通过\n')
  return true
}

async function main() {
  console.log('='.repeat(60))
  console.log('🧪 Notion 双重 API 降级策略测试')
  console.log('='.repeat(60))
  console.log('')
  
  // 检查环境
  if (!(await checkEnvironment())) {
    process.exit(1)
  }
  
  // 执行测试
  const success = await testDualAPI()
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 测试结果:')
  console.log('='.repeat(60))
  
  if (success) {
    console.log('🎉 测试通过！双重API降级策略工作正常')
    console.log('')
    console.log('📋 策略说明:')
    console.log('1. 优先使用 Official API (NOTION_ACCESS_TOKEN)')
    console.log('2. 失败时自动降级到 Unofficial API (NOTION_TOKEN_V2)')
    console.log('3. 提供了完整的容错机制')
    process.exit(0)
  } else {
    console.log('❌ 测试失败！请检查Token配置和网络连接')
    process.exit(1)
  }
}

// 运行测试
main().catch(error => {
  console.error('🚨 测试脚本执行失败:', error)
  process.exit(1)
})