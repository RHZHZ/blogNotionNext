/**
 * API 路由：诊断 Notion summary 配置
 * 使用方法: 访问 http://localhost:3000/api/diagnose-summary
 */

import { Client } from '@notionhq/client'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  console.log('=================================')
  console.log('🔍 诊断 Notion 配置')
  console.log('=================================')

  const diagnostics = {
    steps: [],
    status: 'unknown',
    errors: [],
    warnings: []
  }

  // 步骤 1: 检查环境变量
  console.log('步骤 1: 检查环境变量')
  const token = process.env.NOTION_ACCESS_TOKEN

  if (!token) {
    diagnostics.errors.push({
      step: 1,
      message: 'NOTION_ACCESS_TOKEN 未配置',
      solution: '在 .env.local 中添加 NOTION_ACCESS_TOKEN=your_token'
    })
    diagnostics.steps.push({ step: 1, status: 'fail', message: '环境变量未配置' })
    diagnostics.status = 'failed'
  } else {
    console.log('✅ NOTION_ACCESS_TOKEN 已配置')
    console.log('Token 长度:', token.length)
    console.log('Token 前缀:', token.substring(0, 10) + '...')

    if (!token.startsWith('ntn_')) {
      diagnostics.warnings.push({
        step: 1,
        message: 'NOTION_ACCESS_TOKEN 格式可能不正确',
        info: '通常以 ntn_ 开头'
      })
    }

    diagnostics.steps.push({
      step: 1,
      status: 'success',
      message: `NOTION_ACCESS_TOKEN 已配置 (长度: ${token.length})`
    })
  }

  // 步骤 2: 检查 NOTION_PAGE_ID
  console.log('\n步骤 2: 检查 NOTION_PAGE_ID')
  const pageId = process.env.NOTION_PAGE_ID?.split(',')[0]

  if (!pageId) {
    diagnostics.warnings.push({
      step: 2,
      message: 'NOTION_PAGE_ID 未配置',
      info: '但这个不影响 summary 更新功能'
    })
    diagnostics.steps.push({ step: 2, status: 'warning', message: 'NOTION_PAGE_ID 未配置' })
  } else {
    console.log('✅ NOTION_PAGE_ID 已配置:', pageId)
    diagnostics.steps.push({ step: 2, status: 'success', message: `NOTION_PAGE_ID: ${pageId}` })
  }

  // 步骤 3: 测试 Notion API 连接
  if (token) {
    console.log('\n步骤 3: 测试 Notion API 连接')

    try {
      const client = new Client({ auth: token })

      // 尝试获取用户信息来验证 token
      console.log('正在验证 Token...')
      const user = await client.users.me()

      console.log('✅ Token 验证成功')
      console.log('用户 ID:', user.id)
      console.log('用户名:', user.name || '(无)')

      diagnostics.steps.push({
        step: 3,
        status: 'success',
        message: 'Notion API 连接成功',
        details: { userId: user.id, userName: user.name }
      })

      // 步骤 4: 检查数据库结构
      console.log('\n步骤 4: 检查数据库结构')

      if (pageId && pageId.match(/^[a-f0-9]{32}$/i)) {
        try {
          console.log('正在获取数据库信息...')
          const database = await client.databases.retrieve({ database_id: pageId })

          console.log('✅ 数据库获取成功')
          console.log('数据库标题:', database.title?.[0]?.plain_text || '(无)')

          // 检查是否有 summary 属性
          const properties = database.properties
          const hasSummary = Object.keys(properties).some(key => key.toLowerCase() === 'summary')

          if (hasSummary) {
            const summaryProp = Object.entries(properties).find(([key]) => key.toLowerCase() === 'summary')
            const propName = summaryProp[0]
            const propType = summaryProp[1].type

            console.log('✅ 找到 summary 属性')
            console.log('属性名称:', propName)
            console.log('属性类型:', propType)

            if (propType === 'rich_text') {
              diagnostics.steps.push({
                step: 4,
                status: 'success',
                message: `summary 属性存在且类型正确 (Rich Text)`,
                details: { propName, propType }
              })

              // 步骤 5: 测试更新
              console.log('\n步骤 5: 测试更新 summary 属性')

              // 尝试获取第一页来测试
              const searchResult = await client.search({
                filter: {
                  property: 'object',
                  value: 'page'
                },
                page_size: 1
              })

              if (searchResult.results && searchResult.results.length > 0) {
                const testPageId = searchResult.results[0].id
                const testSummary = '诊断测试: ' + new Date().toLocaleString()

                console.log('测试页面 ID:', testPageId)
                console.log('测试摘要:', testSummary)

                try {
                  await client.pages.update({
                    page_id: testPageId,
                    properties: {
                      [propName]: {
                        rich_text: [
                          {
                            type: 'text',
                            text: { content: testSummary }
                          }
                        ]
                      }
                    }
                  })

                  console.log('✅ 测试更新成功')
                  diagnostics.steps.push({
                    step: 5,
                    status: 'success',
                    message: '测试更新成功',
                    details: { testPageId, testSummary }
                  })
                  diagnostics.status = 'passed'
                } catch (updateError) {
                  console.error('❌ 测试更新失败:', updateError.message)
                  diagnostics.warnings.push({
                    step: 5,
                    message: '测试更新失败',
                    error: updateError.message
                  })
                  diagnostics.steps.push({
                    step: 5,
                    status: 'warning',
                    message: '测试更新失败: ' + updateError.message
                  })
                  diagnostics.status = 'partial'
                }
              } else {
                diagnostics.warnings.push({
                  step: 5,
                  message: '未找到测试页面',
                  info: '无法测试更新功能'
                })
                diagnostics.steps.push({ step: 5, status: 'warning', message: '未找到测试页面' })
                diagnostics.status = 'partial'
              }
            } else {
              diagnostics.errors.push({
                step: 4,
                message: 'summary 属性类型不正确',
                currentType: propType,
                expectedType: 'rich_text',
                solution: '在 Notion 中将 summary 属性类型改为 Rich Text'
              })
              diagnostics.steps.push({
                step: 4,
                status: 'fail',
                message: `summary 属性类型错误 (当前: ${propType}, 需要: rich_text)`
              })
              diagnostics.status = 'failed'
            }
          } else {
            diagnostics.errors.push({
              step: 4,
              message: 'Notion 数据库中没有 summary 属性',
              solution: '在 Notion 数据库中添加 summary 属性 (类型: Rich Text)'
            })
            diagnostics.steps.push({
              step: 4,
              status: 'fail',
              message: 'Notion 数据库中缺少 summary 属性'
            })
            diagnostics.status = 'failed'
          }

        } catch (dbError) {
          console.error('❌ 获取数据库失败:', dbError.message)
          diagnostics.warnings.push({
            step: 4,
            message: '无法获取数据库信息',
            error: dbError.message,
            info: '请确保 NOTION_PAGE_ID 是数据库 ID (32位字符)'
          })
          diagnostics.steps.push({
            step: 4,
            status: 'warning',
            message: '无法获取数据库信息: ' + dbError.message
          })
          diagnostics.status = 'partial'
        }
      } else {
        diagnostics.warnings.push({
          step: 4,
          message: '无法检查数据库结构',
          info: 'NOTION_PAGE_ID 可能不是有效的数据库 ID'
        })
        diagnostics.steps.push({
          step: 4,
          status: 'warning',
          message: '无法检查数据库结构'
        })
        diagnostics.status = 'partial'
      }

    } catch (apiError) {
      console.error('❌ API 连接失败:', apiError.message)
      diagnostics.errors.push({
        step: 3,
        message: 'Notion API 连接失败',
        error: apiError.message,
        solution: '请检查 NOTION_ACCESS_TOKEN 是否正确'
      })
      diagnostics.steps.push({
        step: 3,
        status: 'fail',
        message: 'Notion API 连接失败: ' + apiError.message
      })
      diagnostics.status = 'failed'
    }
  }

  console.log('\n=================================')
  console.log('诊断完成')
  console.log('=================================')

  return res.status(200).json({
    success: diagnostics.status !== 'failed',
    status: diagnostics.status,
    diagnostics
  })
}
