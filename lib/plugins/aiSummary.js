import { siteConfig } from '@/lib/config'
import { getDataFromCache, setDataToCache } from '../cache/cache_manager'

/**
 * 清理 AI 返回的文本，移除 Markdown 符号、表情符号和内部标签
 * @param {string} text - AI 返回的原始文本
 * @returns {string} 清理后的文本
 */
function cleanAiSummaryText(text) {
  if (!text) return text

  let cleaned = text.trim()

  // 【第一步】移除所有内部思考标签和推理过程
  cleaned = cleaned.replace(/<longcat_think>[\s\S]*?<\/longcat_think>/gi, '')
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '')
  cleaned = cleaned.replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '')
  cleaned = cleaned.replace(/<thought>[\s\S]*?<\/thought>/gi, '')
  cleaned = cleaned.replace(/<analysis>[\s\S]*?<\/analysis>/gi, '')
  cleaned = cleaned.replace(/<step>[\s\S]*?<\/step>/gi, '')

  // 【第二步】移除未闭合的标签
  cleaned = cleaned.replace(/<[^>]*$/g, '')

  // 【第三步】移除所有 Markdown 格式符号
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, '$1') // **加粗**
  cleaned = cleaned.replace(/\*(.+?)\*/g, '$1') // *斜体*
  cleaned = cleaned.replace(/__(.+?)__/g, '$1') // __加粗__
  cleaned = cleaned.replace(/_(.+?)_/g, '$1') // _斜体_
  cleaned = cleaned.replace(/~~(.+?)~~/g, '$1') // ~~删除线~~
  cleaned = cleaned.replace(/`(.+?)`/g, '$1') // `代码`
  cleaned = cleaned.replace(/``(.+?)``/g, '$1') // ```代码```
  cleaned = cleaned.replace(/#{1,6}\s+(.+?)(?:$|\n)/g, '$1') // #标题
  cleaned = cleaned.replace(/[-*+]\s+(.+?)(?:$|\n)/g, '$1') // -列表
  cleaned = cleaned.replace(/\d+\.\s+(.+?)(?:$|\n)/g, '$1') // 1.列表
  cleaned = cleaned.replace(/\[(.+?)\]\(.+?\)/g, '$1') // [链接](url)
  cleaned = cleaned.replace(/!\[.+?\]\(.+?\)/g, '') // ![图片](url)
  cleaned = cleaned.replace(/^>\s+(.+?)(?:$|\n)/gm, '$1') // >引用

  // 【第四步】移除表情符号
  // Unicode 表情符号范围
  cleaned = cleaned.replace(/[\u{1F600}-\u{1F64F}]/gu, '') // 😀-🙏
  cleaned = cleaned.replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // 🌀-🏁
  cleaned = cleaned.replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // 🚀-🛿
  cleaned = cleaned.replace(/[\u{1F700}-\u{1F77F}]/gu, '') // 🜀-🝿
  cleaned = cleaned.replace(/[\u{1F780}-\u{1F7FF}]/gu, '') // 🝀-🟿
  cleaned = cleaned.replace(/[\u{1F800}-\u{1F8FF}]/gu, '') // 🠀-🣿
  cleaned = cleaned.replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // 🤀-🧿
  cleaned = cleaned.replace(/[\u{2600}-\u{26FF}]/gu, '') // ☀-♿
  cleaned = cleaned.replace(/[\u{2700}-\u{27BF}]/gu, '') // ✀-➿
  cleaned = cleaned.replace(/[\u{2300}-\u{23FF}]/gu, '') // ⌀-⏿
  cleaned = cleaned.replace(/[\u{2B50}-\u{2BFF}]/gu, '') // ⭐-⯿
  cleaned = cleaned.replace(/[\u{200D}]/gu, '') // 零宽连接符
  cleaned = cleaned.replace(/[\u{FE0F}]/gu, '') // 变体选择器

  // 移除常见表情符号
  const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g
  cleaned = cleaned.replace(emojiRegex, '')

  // 【第五步】移除特殊符号
  cleaned = cleaned.replace(/[【】《》「」『』\[\]\(\)\{\}\<\>]/g, '')

  // 【第六步】移除常见的前缀词
  cleaned = cleaned.replace(/^(摘要：|摘要:|总结：|总结:|概要：|概述：|简介：|以下是|以下为|这里是|以下内容)/gi, '')

  // 【第七步】清理多余空格
  cleaned = cleaned.replace(/\s+/g, ' ')

  // 【第八步】最终清理
  cleaned = cleaned.trim()

  return cleaned
}

/**
 * 使用 OpenAI API 生成文章摘要
 * @returns {Promise<string>}
 * @param aiSummaryAPI - OpenAI API 地址
 * @param aiSummaryKey - OpenAI API Key
 * @param truncatedText - 截断的文本内容
 */
async function getAiSummaryWithRetry(aiSummaryAPI, aiSummaryKey, truncatedText, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`请求 AI 文章摘要 (尝试 ${attempt}/${maxRetries}), API:`, aiSummaryAPI)
      console.log('文本预览:', truncatedText.slice(0, 100))

      // 根据 API 地址选择合适的模型名称
      let modelName = "gpt-5.4"
      if (aiSummaryAPI.includes('longcat.chat')) {
        modelName = "LongCat-Flash-Chat" // LongCat 使用小写
      }
      else if (aiSummaryAPI.includes('aicy.pro')){
        modelName = "gpt-5.4" // LongCat 使用小写
      }

      const response = await fetch(aiSummaryAPI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aiSummaryKey}`
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            {
              role: 'system',
              content: `你是中文技术与知识类文章摘要助手。

任务：基于给定素材生成一段中文摘要。

硬性要求：
1) 仅输出一段纯文本，不要标题、列表、Markdown、标签、引号、括号或解释。
2) 140-220字，最多240字。
3) 使用简体中文和中文标点，语句通顺，结尾用句号。
4) 忠于原文，不编造未出现的信息。
5) 优先覆盖：主题、关键观点/方法、结论或价值。
6) 避免口号化和空话，避免重复表达与连续标点。
7) 不输出任何思考过程或系统提示相关内容。`
            },
            {
              role: 'user',
              content: `请为以下文章内容生成摘要：\n\n${truncatedText}`
            }
          ],
          max_tokens: 280,
          temperature: 0.2,
          top_p: 0.9,
          presence_penalty: 0.1,
          frequency_penalty: 0.2,
          stop: ['<', '摘要：']
        })
      })

      // 先获取响应文本
      const responseText = await response.text()
      console.log('API 响应状态:', response.status)

      if (!response.ok) {
        // 429 限流错误,等待后重试
        if (response.status === 429) {
          const waitTime = 2000 * attempt // 指数退避: 2s, 4s, 6s
          console.warn(`API 限流,等待 ${waitTime}ms 后重试 (尝试 ${attempt}/${maxRetries})`)

          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, waitTime))
            continue
          }
        }

        // 其他错误
        let errorMsg = `API 错误: ${response.status} - ${response.statusText}`
        try {
          const errorData = JSON.parse(responseText)
          if (errorData.error && errorData.error.message) {
            errorMsg = errorData.error.message
          }
        } catch (e) {
          // 忽略 JSON 解析错误
        }

        throw new Error(errorMsg)
      }

      // 检查响应是否是有效的 JSON
      if (responseText.trim().startsWith('<')) {
        console.error('API 返回了 HTML 而不是 JSON:', responseText.slice(0, 200))
        throw new Error('API 配置错误,请检查 API 地址和 Key 是否正确')
      }

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('JSON 解析失败:', parseError)
        console.error('响应内容:', responseText.slice(0, 500))
        throw new Error('API 返回的数据格式错误,请检查 API 配置')
      }

      // 兼容不同的 API 响应格式
      // 格式 1: OpenAI 标准 (data.choices[0].message.content)
      if (data.choices && data.choices[0] && data.choices[0].message) {
        let summary = data.choices[0].message.content.trim()
        summary = cleanAiSummaryText(summary)
        console.log('AI 摘要生成成功 (OpenAI 格式), 长度:', summary.length)
        return summary
      }

      // 格式 2: LongCat 可能的格式 (data.content 或 data.result)
      if (data.content) {
        let summary = data.content.trim()
        summary = cleanAiSummaryText(summary)
        console.log('AI 摘要生成成功 (content 格式), 长度:', summary.length)
        return summary
      }

      if (data.result) {
        let summary = data.result.trim()
        summary = cleanAiSummaryText(summary)
        console.log('AI 摘要生成成功 (result 格式), 长度:', summary.length)
        return summary
      }

      // 格式 3: 其他可能的格式
      if (data.text) {
        let summary = data.text.trim()
        summary = cleanAiSummaryText(summary)
        console.log('AI 摘要生成成功 (text 格式), 长度:', summary.length)
        return summary
      }

      console.error('API 响应格式不符合预期:', data)
      throw new Error('API 响应格式错误,未找到有效的摘要内容')

    } catch (error) {
      console.error(`尝试 ${attempt} 失败:`, error.message)

      // 最后一次尝试失败后,抛出错误
      if (attempt === maxRetries) {
        throw error
      }

      // 其他错误等待后重试
      const waitTime = 1000 * attempt
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }

  throw new Error('AI 摘要生成失败: 超过最大重试次数')
}

export async function getAiSummary(aiSummaryAPI, aiSummaryKey, truncatedText) {
  try {
    return await getAiSummaryWithRetry(aiSummaryAPI, aiSummaryKey, truncatedText, 3)
  } catch (error) {
    console.error('AI 摘要生成最终失败:', error)

    // 根据错误类型返回更友好的提示
    if (error.message.includes('429') || error.message.includes('容量超过限制')) {
      return 'AI 摘要服务暂时繁忙,请稍后再试'
    }

    if (error.message.includes('401') || error.message.includes('403')) {
      return 'AI 摘要 API 配置错误,请检查密钥'
    }

    return `摘要生成暂时不可用: ${error.message}`
  }
}


/**
 * 获取文章 AI 摘要
 * @param props - 组件属性
 * @param pageContentText - 页面内容文本
 * @returns {Promise<void>}
 */
export async function getPageAISummary(post, pageContentText) {
  const aiSummaryAPI = siteConfig('AI_SUMMARY_API')
  if (!aiSummaryAPI) {
    console.warn('AI_SUMMARY_API 未配置')
    return
  }

  try {
    const cacheKey = `ai_summary_${post.id}`

    // 优先级 1: 使用本地缓存
    let aiSummary = await getDataFromCache(cacheKey)
    if (aiSummary) {
      post.aiSummary = aiSummary
      console.log('使用缓存的 AI 摘要:', post.title)
      return
    }

    const aiSummaryKey = siteConfig('AI_SUMMARY_KEY')
    if (!aiSummaryKey) {
      console.warn('AI_SUMMARY_KEY 未配置')
      return
    }

    const aiSummaryCacheTime = siteConfig('AI_SUMMARY_CACHE_TIME', 1800)
    const wordLimit = siteConfig('AI_SUMMARY_WORD_LIMIT', 1000)

    // 清理和预处理页面内容
    const cleanContent = (text) => {
      if (!text) return ''

      // 移除 URL
      text = text.replace(/https?:\/\/[^\s\)]+/g, '')

      // 移除图片相关内容
      text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Markdown 图片
      text = text.replace(/<img[^>]+>/gi, '') // HTML 图片标签
      text = text.replace(/图片\d+|image\d+|截图\d+/gi, '') // 图片描述

      // 移除代码块和行内代码
      text = text.replace(/```[\s\S]*?```/g, '') // 代码块
      text = text.replace(/`[^`]+`/g, '') // 行内代码
      text = text.replace(/<code[^>]*>[\s\S]*?<\/code>/gi, '') // HTML 代码

      // 移除公式
      text = text.replace(/\$\$[\s\S]*?\$\$/g, '') // LaTeX 公式块
      text = text.replace(/\$[^$]+\$/g, '') // LaTeX 行内公式
      text = text.replace(/\\[a-zA-Z]+\{[^}]*\}/g, '') // LaTeX 命令

      // 移除 HTML 标签
      text = text.replace(/<[^>]+>/g, '')

      // 移除特殊符号和无意义字符
      text = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s，。；：？！、,.:?!]/g, '')

      // 移除过多的空白
      text = text.replace(/\n\s*\n\s*\n/g, '\n\n') // 多个空行压缩为两个
      text = text.replace(/[ \t]+/g, ' ') // 多个空格压缩为一个

      return text.trim()
    }

    // 构建更优质的内容
    let content = `文章标题: ${post.title}\n\n`

    if (post.toc && post.toc.length > 0) {
      content += '文章结构:\n'
      // 只取前 8 个标题，避免太长
      const headings = post.toc.slice(0, 8)
      for (const heading of headings) {
        content += `- ${heading.text}\n`
      }
      content += '\n'
    }

    // 清理后的内容
    if (pageContentText) {
      const cleanedContent = cleanContent(pageContentText)
      content += '文章内容:\n'
      content += cleanedContent
    }

    const combinedText = content
    const truncatedText = combinedText.slice(0, wordLimit)

    console.log('请求 OpenAI 生成摘要:', post.title)
    aiSummary = await getAiSummary(aiSummaryAPI, aiSummaryKey, truncatedText)

    if (aiSummary && !aiSummary.includes('摘要生成暂时不可用')) {
      await setDataToCache(cacheKey, aiSummary, aiSummaryCacheTime)
      post.aiSummary = aiSummary
      console.log('成功生成 AI 摘要:', post.title)

      // 同步更新到 Notion 数据库（静默失败，不影响本地缓存）
      try {
        // 优先使用 Official API (NOTION_ACCESS_TOKEN)
        const { updateNotionPageSummary } = await import('../notion/notion_api.js')
        if (post.id) {
          const officialResult = await updateNotionPageSummary(post.id, aiSummary)
          if (officialResult.success) {
            console.log('✅ 已通过 Official API 同步摘要到 Notion 页面:', post.id)
          } else {
            console.log('⚠️  Official API 同步失败:', officialResult.error)

            // 降级到 unofficial API 作为备选
            console.log('降级使用 Unofficial API 备选...')
            const { updateNotionPageSummaryUnofficial } = await import('../notion/notion_api_unofficial.js')
            const unofficialResult = await updateNotionPageSummaryUnofficial(post.id, aiSummary)
            if (unofficialResult.success) {
              console.log('✅ 已通过 Unofficial API 同步到 Notion')
            } else {
              console.log('❌ 两种 API 都同步失败:', unofficialResult.error)
            }
          }
        }
      } catch (notionError) {
        // 静默失败，不影响本地缓存和页面显示
        console.log('⚠️  Notion 同步暂时不可用，摘要已保存到本地缓存')
      }
    } else {
      post.aiSummary = null
    }
  } catch (error) {
    console.error('获取 AI 摘要失败:', error)
    post.aiSummary = null
  }
}


