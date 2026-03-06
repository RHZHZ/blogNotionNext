/**
 * 使用 OpenAI API 生成文章摘要
 * @returns {Promise<string>}
 * @param aiSummaryAPI - OpenAI API 地址
 * @param aiSummaryKey - OpenAI API Key
 * @param truncatedText - 截断的文本内容
 */
export async function getAiSummary(aiSummaryAPI, aiSummaryKey, truncatedText) {
  try {
    console.log('请求 OpenAI 文章摘要', truncatedText.slice(0, 100))

    const response = await fetch(aiSummaryAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aiSummaryKey}`
      },
      body: JSON.stringify({
        model: "LongCat-Flash-Thinking-2601",
        messages: [
          {
            role: "system",
            content: "你是一个专业的文章摘要生成器。请为以下文章内容生成一个简洁、准确、有吸引力的摘要，不超过150字，突出文章的核心观点和价值。"
          },
          {
            role: "user",
            content: truncatedText
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
        top_p: 0.9,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`OpenAI API 错误: ${response.status} - ${errorData.error?.message || '未知错误'}`)
    }

    const data = await response.json()

    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content.trim()
    } else {
      throw new Error('OpenAI API 响应格式错误')
    }

  } catch (error) {
    console.error('OpenAI 摘要生成失败:', error)
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

    // 构建更优质的内容
    let content = `文章标题: ${post.title}\n\n`

    if (post.toc && post.toc.length > 0) {
      content += '文章目录:\n'
      for (let heading of post.toc) {
        const level = '  '.repeat(heading.level - 1)
        content += `${level}${heading.text}\n`
      }
      content += '\n'
    }

    if (pageContentText) {
      content += '文章内容:\n'
      content += pageContentText
    }

    const combinedText = content
    const truncatedText = combinedText.slice(0, wordLimit)

    console.log('请求 OpenAI 生成摘要:', post.title)
    aiSummary = await getAiSummary(aiSummaryAPI, aiSummaryKey, truncatedText)

    if (aiSummary && !aiSummary.includes('摘要生成暂时不可用')) {
      await setDataToCache(cacheKey, aiSummary, aiSummaryCacheTime)
      post.aiSummary = aiSummary
      console.log('成功生成 AI 摘要:', post.title)
    } else {
      post.aiSummary = null
    }
  } catch (error) {
    console.error('获取 AI 摘要失败:', error)
    post.aiSummary = null
  }
}


