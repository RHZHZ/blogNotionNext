import { siteConfig } from '@/lib/config'
import { isValidAiSummary } from '@/lib/utils'
import { getDataFromCache, setDataToCache } from '../cache/cache_manager'

function getSummaryMinLength() {
  return Number(siteConfig('AI_SUMMARY_MIN_LENGTH', 24)) || 24
}

function normalizeSummaryLengthTarget(sourceText = '') {
  const length = sourceText.length
  const shortTarget = siteConfig('AI_SUMMARY_LENGTH_SHORT', '60-100字')
  const mediumTarget = siteConfig('AI_SUMMARY_LENGTH_MEDIUM', '90-140字')
  const longTarget = siteConfig('AI_SUMMARY_LENGTH_LONG', '120-180字')
  const xLongTarget = siteConfig('AI_SUMMARY_LENGTH_XLONG', '150-220字')

  if (length < 800) return shortTarget
  if (length < 1800) return mediumTarget
  if (length < 3200) return longTarget
  return xLongTarget
}

function removeInternalTags(text) {
  return text
    .replace(/<longcat_think>[\s\S]*?<\/longcat_think>/gi, ' ')
    .replace(/<think>[\s\S]*?<\/think>/gi, ' ')
    .replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, ' ')
    .replace(/<thought>[\s\S]*?<\/thought>/gi, ' ')
    .replace(/<analysis>[\s\S]*?<\/analysis>/gi, ' ')
    .replace(/<step>[\s\S]*?<\/step>/gi, ' ')
    .replace(/<[^>]*$/g, ' ')
}

function extractTextFromMessageContent(content) {
  if (!content) return ''
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content
      .map(item => {
        if (typeof item === 'string') return item
        if (item?.type === 'text') {
          if (typeof item.text === 'string') return item.text
          if (typeof item.text?.value === 'string') return item.text.value
        }
        if (typeof item?.value === 'string') return item.value
        return ''
      })
      .filter(Boolean)
      .join(' ')
  }
  return ''
}

function extractSummaryFromResponse(data) {
  const candidates = [
    extractTextFromMessageContent(data?.choices?.[0]?.message?.content),
    typeof data?.choices?.[0]?.text === 'string' ? data.choices[0].text : '',
    typeof data?.content === 'string' ? data.content : '',
    typeof data?.result === 'string' ? data.result : '',
    typeof data?.text === 'string' ? data.text : ''
  ]

  return candidates.find(item => typeof item === 'string' && item.trim()) || ''
}

function normalizeLineText(text = '') {
  return text
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \f\v]+/g, ' ')
    .trim()
}

function cleanPageContent(text) {
  if (!text) return ''

  let cleaned = String(text)

  cleaned = cleaned
    .replace(/```[\s\S]*?```/g, '\n ')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, ' $1 ')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '$1')
    .replace(/https?:\/\/[^\s)]+/g, ' ')
    .replace(/<img[^>]*alt=["']([^"']*)["'][^>]*>/gi, ' $1 ')
    .replace(/<img[^>]*>/gi, ' ')
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, ' $1 ')
    .replace(/`([^`]+)`/g, ' $1 ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' 公式推导 ')
    .replace(/\$([^$]+)\$/g, ' $1 ')
    .replace(/\\[a-zA-Z]+\{([^}]*)\}/g, ' $1 ')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/p>|<\/div>|<\/li>|<\/section>|<\/article>|<\/h[1-6]>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/图片\d+|image\d+|截图\d+/gi, ' ')
    .replace(/[“”"'`]/g, ' ')
    .replace(/[【】《》「」『』]/g, ' ')
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s，。；：？！、,.:;!?%+\-/#&]/g, ' ')

  return normalizeLineText(cleaned)
}

function sampleTextSegments(text, maxLength, segmentLimit = 9) {
  if (!text) return ''
  if (text.length <= maxLength) return text

  const paragraphs = text.split(/\n{2,}|\n/).map(item => item.trim()).filter(Boolean)
  if (paragraphs.length === 0) return text.slice(0, maxLength)

  const normalizedLimit = Math.max(3, Number(segmentLimit) || 9)
  const pickCount = Math.min(paragraphs.length, normalizedLimit)
  const headCount = Math.min(3, pickCount)
  const tailCount = Math.min(3, Math.max(0, pickCount - headCount))
  const middleCount = Math.max(0, pickCount - headCount - tailCount)

  const head = paragraphs.slice(0, headCount)
  const tail = tailCount > 0 ? paragraphs.slice(-tailCount) : []
  const middleSource = paragraphs.slice(headCount, Math.max(headCount, paragraphs.length - tailCount))
  const middle = []

  if (middleCount > 0 && middleSource.length > 0) {
    if (middleCount === 1) {
      middle.push(middleSource[Math.floor(middleSource.length / 2)])
    } else {
      for (let i = 0; i < middleCount; i++) {
        const index = Math.min(
          middleSource.length - 1,
          Math.floor(((i + 1) * middleSource.length) / (middleCount + 1))
        )
        middle.push(middleSource[index])
      }
    }
  }

  const selected = [...head, ...middle, ...tail]
  const deduped = [...new Set(selected)]

  return deduped.join('\n\n').slice(0, maxLength)
}

function buildSummaryPrompt(sourceText, summaryLengthTarget) {
  return [
    '你是中文技术与知识类文章摘要助手。',
    '请基于给定素材提炼一段高信息密度中文摘要。',
    '',
    '摘要策略：',
    '1) 优先概括文章主题。',
    '2) 提炼关键观点、方法、步骤或解决方案。',
    '3) 尽量覆盖结论、结果、适用场景或实际价值。',
    '4) 若是教程文，优先写目标、关键步骤与适用对象。',
    '5) 若是技术方案文，优先写问题、方案与效果。',
    '6) 若是观点分析文，优先写核心论点与结论。',
    '',
    '输出要求：',
    `1) 仅输出一段纯文本摘要，长度控制在${summaryLengthTarget}。`,
    '2) 不要标题、列表、Markdown、标签、引号、解释或客套话。',
    '3) 避免使用“本文介绍了”“文章主要讲了”等模板句。',
    '4) 使用简体中文和中文标点，表达准确、紧凑、自然，结尾用句号。',
    '5) 忠于原文，不编造未出现的信息，不输出思考过程。',
    '',
    `以下是待摘要内容：\n\n${sourceText}`
  ].join('\n')
}

function cleanAiSummaryText(text) {
  if (!text) return ''

  let cleaned = removeInternalTags(String(text).trim())

  cleaned = cleaned
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+[.)]\s+/gm, '')
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}-\u{2BFF}\u{200D}\u{FE0F}]/gu, '')
    .replace(/^(摘要|总结|概要|概述|内容摘要|文章摘要|简要总结|总结如下|核心内容)\s*[:：-]\s*/i, '')
    .replace(/^(本文|这篇文章|文章)\s*(主要)?(介绍|讲述|讨论|分享|阐述|说明)了?/i, '')
    .replace(/[ \t\f\v]+/g, ' ')
    .replace(/\s*([，。；：！？,.!?])\s*/g, '$1')
    .replace(/([，。；：！？,.!?]){2,}/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()

  if (cleaned && !/[。！？!?]$/.test(cleaned)) {
    cleaned += '。'
  }

  return cleaned
}

async function getAiSummaryWithRetry(aiSummaryAPI, aiSummaryKey, truncatedText, maxRetries = 3, summaryLengthTarget = '120-180字') {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`请求 AI 文章摘要 (尝试 ${attempt}/${maxRetries}), API:`, aiSummaryAPI)
      console.log('文本预览:', truncatedText.slice(0, 100))

      let modelName = 'gpt-5.4'
      if (aiSummaryAPI.includes('longcat.chat')) {
        modelName = 'LongCat-Flash-Chat'
      } else if (aiSummaryAPI.includes('aicy.pro')) {
        modelName = 'gpt-5.4'
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
              content: buildSummaryPrompt(truncatedText, summaryLengthTarget)
            },
            {
              role: 'user',
              content: '请直接输出摘要正文。'
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

      const responseText = await response.text()
      console.log('API 响应状态:', response.status)

      if (!response.ok) {
        if (response.status === 429) {
          const waitTime = 2000 * attempt
          console.warn(`API 限流,等待 ${waitTime}ms 后重试 (尝试 ${attempt}/${maxRetries})`)

          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, waitTime))
            continue
          }
        }

        let errorMsg = `API 错误: ${response.status} - ${response.statusText}`
        try {
          const errorData = JSON.parse(responseText)
          if (errorData.error && errorData.error.message) {
            errorMsg = errorData.error.message
          }
        } catch (e) {
        }

        throw new Error(errorMsg)
      }

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

      const rawSummary = extractSummaryFromResponse(data)
      const summary = cleanAiSummaryText(rawSummary)

      if (!summary) {
        console.error('API 响应中未提取到有效摘要:', data)
        throw new Error('API 响应格式错误,未找到有效的摘要内容')
      }

      if (summary.length < getSummaryMinLength()) {
        console.error('摘要内容过短,疑似无效响应:', summary)
        throw new Error('AI 返回的摘要内容过短,请稍后重试')
      }

      console.log('AI 摘要生成成功, 长度:', summary.length)
      return summary
    } catch (error) {
      console.error(`尝试 ${attempt} 失败:`, error.message)

      if (attempt === maxRetries) {
        throw error
      }

      const waitTime = 1000 * attempt
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }

  throw new Error('AI 摘要生成失败: 超过最大重试次数')
}

export async function getAiSummary(aiSummaryAPI, aiSummaryKey, truncatedText, summaryLengthTarget = '120-180字') {
  try {
    return await getAiSummaryWithRetry(aiSummaryAPI, aiSummaryKey, truncatedText, 3, summaryLengthTarget)
  } catch (error) {
    console.error('AI 摘要生成最终失败:', error)

    if (error.message.includes('429') || error.message.includes('容量超过限制')) {
      return 'AI 摘要服务暂时繁忙,请稍后再试'
    }

    if (error.message.includes('401') || error.message.includes('403')) {
      return 'AI 摘要 API 配置错误,请检查密钥'
    }

    return `摘要生成暂时不可用: ${error.message}`
  }
}

export async function getPageAISummary(post, pageContentText) {
  const aiSummaryAPI = siteConfig('AI_SUMMARY_API')
  if (!aiSummaryAPI) {
    console.warn('AI_SUMMARY_API 未配置')
    return
  }

  try {
    const cacheKey = `ai_summary_${post.id}`

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
    const wordLimit = Number(siteConfig('AI_SUMMARY_WORD_LIMIT', 1000)) || 1000
    const tocLimit = Number(siteConfig('AI_SUMMARY_TOC_LIMIT', 8)) || 8
    const segmentLimit = Number(siteConfig('AI_SUMMARY_SEGMENT_LIMIT', 9)) || 9

    let content = `文章标题: ${post.title || '未命名文章'}\n\n`

    if (post.toc && post.toc.length > 0) {
      content += '文章结构:\n'
      const headings = post.toc
        .slice(0, tocLimit)
        .map(item => item?.text)
        .filter(Boolean)
      for (const heading of headings) {
        content += `- ${normalizeLineText(heading)}\n`
      }
      content += '\n'
    }

    if (pageContentText) {
      const cleanedContent = cleanPageContent(pageContentText)
      const sampledContent = sampleTextSegments(cleanedContent, Math.max(300, wordLimit), segmentLimit)
      if (sampledContent) {
        content += '文章内容:\n'
        content += sampledContent
      }
    }

    const combinedText = normalizeLineText(content)
    const truncatedText = combinedText.slice(0, wordLimit)
    const summaryLengthTarget = normalizeSummaryLengthTarget(truncatedText)

    console.log('请求 OpenAI 生成摘要:', post.title)
    aiSummary = await getAiSummary(aiSummaryAPI, aiSummaryKey, truncatedText, summaryLengthTarget)

    if (isValidAiSummary(aiSummary)) {
      await setDataToCache(cacheKey, aiSummary, aiSummaryCacheTime)
      post.aiSummary = aiSummary
      console.log('成功生成 AI 摘要:', post.title)

      try {
        const { updateNotionPageSummary } = await import('../notion/notion_api.js')
        if (post.id) {
          const officialResult = await updateNotionPageSummary(post.id, aiSummary)
          if (officialResult.success) {
            console.log('✅ 已通过 Official API 同步摘要到 Notion 页面:', post.id)
          } else {
            console.log('⚠️  Official API 同步失败:', officialResult.error)

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

