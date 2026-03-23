const fs = require('fs/promises')
const path = require('path')
const { loadLocalEnv } = require('./load-local-env')

loadLocalEnv()

const ROOT = process.cwd()

const TEMP_DIR = path.join(ROOT, 'temp')
const DEFAULT_CANDIDATES_FILE = path.join(TEMP_DIR, 'ai-daily-candidates.json')
const DEFAULT_POST_JSON = path.join(TEMP_DIR, 'ai-daily-post.json')
const DEFAULT_POST_MD = path.join(TEMP_DIR, 'ai-daily-post.md')

function parseRequestedDate(value = '') {
  const normalized = String(value || '').trim()
  if (!normalized) return ''
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    throw new Error('AI_DAILY_DATE 格式错误，应为 YYYY-MM-DD')
  }
  return normalized
}

function normalizeDate(date = new Date()) {

  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10)
}

function stripMarkdown(value = '') {
  return String(value)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\(([^)]*)\)/g, '$1')
    .replace(/^>\s+/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_{1,2}([^_]+)_{1,2}/g, '$1')
    .replace(/^-\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/---+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractSummaryFromMarkdown(markdown = '') {
  const normalized = String(markdown || '').replace(/\r\n/g, '\n')
  const lines = normalized.split('\n').map(line => line.trim()).filter(Boolean)
  const preferred = lines.find(line => /^\*\*.+\*\*$/.test(line) || /^(结论|判断|如果只看今天|今天最重要的)/.test(line))
  const candidate = preferred || lines.find(line => !line.startsWith('##') && !line.startsWith('###') && !line.startsWith('- ') && !/^\d+\./.test(line)) || ''
  const clean = stripMarkdown(candidate)
  if (!clean) return ''
  return clean.slice(0, 140)
}

function buildInsightTitle(item = {}, index = 0) {
  const source = String(item.source || '这条动态')
  const category = String(item.category || '')
  const rawTitle = stripMarkdown(item.title || '')
  const summary = stripMarkdown(item.summary || '')

  const shortSummary = summary.slice(0, 28)
  const shortTitle = rawTitle.slice(0, 26)

  if (shortSummary) {
    return `${index + 1}. ${shortSummary}${shortSummary.endsWith('。') ? '' : '：'}这是今天更值得优先看的变化`
  }

  if (category) {
    return `${index + 1}. ${source} 把今天的关注点推向了「${category}」`
  }

  if (shortTitle) {
    return `${index + 1}. ${shortTitle} 背后更值得看的，是它释放出的新信号`
  }

  return `${index + 1}. 这条动态更值得看的，是它所代表的方向变化`
}

function injectItemImagesIntoMarkdown(markdown = '', items = []) {
  const lines = String(markdown || '').replace(/\r\n/g, '\n').split('\n')
  const headings = []

  for (let index = 0; index < lines.length; index += 1) {
    if (/^###\s+/.test(lines[index].trim())) {
      headings.push(index)
    }
  }

  if (!headings.length) return markdown

  const result = [...lines]
  let offset = 0
  const count = Math.min(headings.length, items.length)

  for (let i = 0; i < count; i += 1) {
    const item = items[i]
    const image = String(item?.image || '').trim()
    if (!image) continue

    const start = headings[i] + offset
    const nextHeading = i + 1 < headings.length ? headings[i + 1] + offset : result.length
    const sectionLines = result.slice(start + 1, nextHeading)
    const alreadyHasImage = sectionLines.some(line => /^!\[[^\]]*\]\((https?:\/\/[^)]+)\)$/.test(line.trim()))
    if (alreadyHasImage) continue

    const insertAt = start + 1
    const alt = stripMarkdown(item.title || `AI 情报配图 ${i + 1}`)
    result.splice(insertAt, 0, `![${alt}](${image})`, '')
    offset += 2
  }

  return result.join('\n')
}



function buildDefaultMarkdown({ title, items }) {


  const topItems = items.slice(0, 6)
  const sourceNames = Array.from(new Set(topItems.map(item => item.source).filter(Boolean)))
  const sections = topItems.map((item, index) => {
    const conclusion = item.summary || '这条动态的信息增量较高，值得优先看完。'
    const whyItMatters = item.whyItMatters || '它真正值得关注的地方，不在于“又多了一条新闻”，而在于它反映了产品、模型或开发工具链正在发生的实际变化。'
    const impact = item.category || '模型、产品与开发者工具'
    const insightTitle = buildInsightTitle(item, index)
    return [
      `### ${insightTitle}`,

      '',
      `**先说判断：** ${conclusion}`,
      '',
      `这一条最值得看的，不只是它说了什么，而是它把今天的关注点进一步推向了“${impact}”这条主线。`,
      '',
      '- **关键信息**：',
      `  - 来源：${item.source || '未知来源'}`,
      `  - 类别：${impact}`,
      item.publishedAt ? `  - 发布时间：${item.publishedAt}` : '  - 发布时间：待补充',
      '',
      `**为什么现在值得看：** ${whyItMatters}`,
      '',
      `**对谁更重要：** 如果你最近在关注 ${impact} 相关方向，这条信息更值得优先消化。`,
      '',
      `**原始链接：** ${item.url || '待补充'}`
    ].join('\n')
  })

  return [
    `# ${title}`,
    '',
    '> 今天真正值得看的，不是“信息又多了几条”，而是哪几条已经开始影响开发者工具、产品能力和实际落地。',
    '',
    '## 今日总览',
    `今天这份 AI 日报，优先筛选上海时区当天的主源推送内容，再补充少量真正有信息增量的条目。相比零散快讯，更值得看的是：哪些变化已经开始变成可用的能力、可落地的工具和更明确的行业信号。`,
    '',
    '- **3 个核心判断**：',
    '- **判断一**：今天值得看的重点，不是单条新闻本身，而是它们共同指向的产品化进展。',
    '- **判断二**：开发者真正需要关注的，是哪些能力开始变得可调用、可接入、可复用。',
    '- **判断三**：如果一条信息不能影响工作流、使用体验或工具链，它的重要性就应该后排。',
    '',
    '---',
    '',
    '## 今天最值得看的 5-7 条',
    '',
    sections.join('\n\n---\n\n'),
    '',
    '---',
    '',
    '## 开发者视角',
    `今天这批信息里，更值得开发者重点看的通常集中在三个方向：一是模型或产品能力有没有进一步开放；二是工具链是否缩短了接入、调试或部署路径；三是哪些信号说明“能演示”正在变成“能落地”。${sourceNames.length ? `这篇内容涉及的核心来源包括：${sourceNames.join('、')}。` : ''}`,
    '',
    '- **如果你做内容或产品**：优先看哪些能力已经变成用户能直接感知的体验。',
    '- **如果你做开发或工作流**：优先看哪些工具、接口、平台更新能立刻接入现有流程。',
    '- **如果你关注行业判断**：优先看哪些变化不是概念升级，而是实际执行能力升级。',
    '',
    '## 今天的判断',
    '如果只看今天，一个更清晰的判断是：AI 内容已经不适合再按“新闻列表”来理解，而应该按“哪些东西正在变得可用、可部署、可持续”来筛选。真正值得留下来的，不是热闹感，而是那些能改变工作方式的增量。',
    '',
    '## RHZ 简评',
    '这类日报最怕写成平铺直叙的信息堆积，所以更好的方法不是把内容写更多，而是把真正有价值的那几条先拎出来。对读者来说，最好的阅读体验永远不是“看完全部”，而是“很快知道今天最该看什么”。',
    ''
  ].join('\n')
}


async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true })
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8')
  return JSON.parse(raw)
}

async function removeFileIfExists(filePath) {
  try {
    await fs.unlink(filePath)
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error
    }
  }
}

async function clearGeneratedPostArtifacts(postJsonFile, postMdFile) {
  await Promise.all([
    removeFileIfExists(postJsonFile),
    removeFileIfExists(postMdFile)
  ])
}

async function generateWithApi({ apiUrl, apiKey, prompt }) {

  const model = process.env.AI_DAILY_MODEL || process.env.AI_SUMMARY_MODEL || 'gpt-5.4'

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: [
            '你是 RHZ 的中文技术博客编辑，擅长把 AI 动态写成有判断、有节奏、适合长文阅读的日报。',
            '文章要适合 HEO 主题阅读体验：开头抓人、段落短、层次清晰、标题明确、适合目录导航。',
            '不要写成资讯站快讯堆砌，也不要只复述新闻；要像一个有审美和判断的个人博客作者。',
            '输出只包含 Markdown 正文，不要解释，不要 JSON。',
            '每个重点情报都必须包含：发生了什么、为什么值得看、对开发者意味着什么。',
            '请避免空洞套话，优先写能让人继续往下读的具体判断。'
          ].join(' ')
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.55,
      max_tokens: 4200
    })
  })


  const text = await response.text()
  if (!response.ok) {
    throw new Error(`AI 接口请求失败: ${response.status} ${text.slice(0, 200)}`)
  }

  const data = JSON.parse(text)
  return data?.choices?.[0]?.message?.content?.trim() || ''
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function generateWithRetry({ apiUrl, apiKey, prompt }) {
  const maxAttempts = Math.max(1, Number(process.env.AI_DAILY_GENERATE_MAX_RETRIES || 3))
  const retryDelayMs = Math.max(0, Number(process.env.AI_DAILY_GENERATE_RETRY_DELAY_MS || 120000))
  let lastError = null

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      if (attempt > 1) {
        console.log(`🔁 正在进行第 ${attempt}/${maxAttempts} 次 AI 正文生成尝试...`)
      }
      return await generateWithApi({ apiUrl, apiKey, prompt })
    } catch (error) {
      lastError = error
      const isLastAttempt = attempt >= maxAttempts
      console.warn(`⚠️ 第 ${attempt}/${maxAttempts} 次 AI 正文生成失败：${error.message}`)
      if (!isLastAttempt && retryDelayMs > 0) {
        console.log(`⏳ ${retryDelayMs}ms 后重试 AI 正文生成...`)
        await sleep(retryDelayMs)
      }
    }
  }

  throw lastError || new Error('AI 正文生成失败，且未捕获到具体错误')
}

async function main() {

  const candidatesFile = process.env.AI_DAILY_CANDIDATES_FILE || DEFAULT_CANDIDATES_FILE
  const postJsonFile = process.env.AI_DAILY_POST_JSON || DEFAULT_POST_JSON
  const postMdFile = process.env.AI_DAILY_POST_MD || DEFAULT_POST_MD
  const requestedDate = parseRequestedDate(process.env.AI_DAILY_DATE)
  const targetDate = requestedDate || normalizeDate()


  console.log('开始生成每日 AI 情报正文...')
  console.log(`候选池文件: ${candidatesFile}`)
  if (requestedDate) {
    console.log(`指定日期模式: ${requestedDate}`)
  }


  const candidates = await readJson(candidatesFile)
  const items = Array.isArray(candidates.items) ? candidates.items : []

  if (!items.length) {
    const candidateDate = String(candidates.date || targetDate).trim()
    const alreadyPublishedToday = Boolean(candidates.alreadyPublishedToday)
    const shouldWaitForPrimary = Boolean(candidates.shouldWaitForPrimary)
    if (alreadyPublishedToday) {
      await clearGeneratedPostArtifacts(postJsonFile, postMdFile)
      console.log(`✅ 目标日期 ${candidateDate} 的 AI 日报已存在，已清理旧正文产物并跳过本次生成。`)
      return
    }
    if (shouldWaitForPrimary) {
      await clearGeneratedPostArtifacts(postJsonFile, postMdFile)
      console.log(`⏳ 目标日期 ${candidateDate} 仍处于主源等待窗口，已清理旧正文产物并跳过本次生成。`)
      return
    }
    throw new Error(`目标日期 ${candidateDate} 的候选池为空，无法生成日报正文`)
  }




  const title = `每日 AI 情报｜${candidates.date || targetDate}`
  const slug = `daily-ai-news-${candidates.date || targetDate}`
  let markdown = ''
  let generationMode = 'template'
  let generationStatus = 'fallback'
  let generationWarning = ''

  const apiUrl = process.env.AI_DAILY_API || process.env.AI_SUMMARY_API || ''

  const apiKey = process.env.AI_DAILY_KEY || process.env.AI_SUMMARY_KEY || ''

  if (apiUrl && apiKey) {
    const prompt = [
      `请根据下面整理好的 AI 情报素材，为 ${title} 生成一篇适合直接发布到 RHZ 博客的中文 Markdown 长文。`,

      '',
      '写作目标：',
      '1. 不是简单汇总，而是帮读者快速判断今天真正值得看的变化。',
      '2. 文章必须具备明显的扫读体验：读者应能在 20 秒内看懂今天最值得看的 3-5 个点。',
      '3. 风格像个人技术博客，不像门户资讯站，也不像按时间倒序罗列的快讯流。',
      '4. 面向开发者，但也要照顾普通科技读者的理解成本。',
      '',
      '结构要求：',
      '1. 仅输出 Markdown。',
      '2. 不要再输出文章总标题，因为页面已有标题。',
      '3. 只使用这些 Markdown 结构：##、###、普通段落、- 无序列表、1. 编号列表、> 引用、--- 分隔线、**加粗**、Markdown 链接。不要使用表格、代码块、HTML、自定义标签。',
      '4. 必须包含这些二级标题：今日总览、今天最值得看的 5-7 条、开发者视角、今天的判断、RHZ 简评。',
      '5. 在“今日总览”里，先用 1 段给出今天的主判断，再用 3 条 bullet 写“3 个核心判断”，每条都要短、狠、明确。',
      '6. 在“今天最值得看的 5-7 条”下面，每条都用三级标题，标题必须是观点句或判断句，禁止直接复述原标题，最好让读者只看标题就知道这条信息为什么重要。',
      '7. 每条三级标题下面第一段必须先给一句结论式开场，让读者一眼知道这条为什么值得读。',

      '8. 每条内容至少包含四个阅读锚点：一句判断、发生了什么、为什么值得关注、对谁影响更大。',
      '9. 如果某条素材提供了 image 字段且是明显可用的文章首图，可以在该条三级标题下插入 1 张 Markdown 图片，增强可读性；没有图片就不要强行补图。',
      '10. 多用短段落，每段尽量不超过 3 行，不要写连续大段文字墙。',
      '11. 可以用少量 bullet 提取关键信息，让正文兼顾扫读与深读。',
      '12. 每个大章节之间可以用 --- 分隔，但不要滥用。',
      '13. 结尾要有总结判断，收住全文。',

      '',
      '内容要求：',
      '1. 优先选择开发者价值高、信息增量大的候选，不要把明显偏泛资讯的内容写成重点。',
      '2. 允许引用原始来源名称和链接，但不要让链接喧宾夺主。',
      '3. 不要使用僵硬模板腔，但要保留清晰阅读节奏，让每条信息边界明显。',
      '4. 如果某条信息不够硬核但行业意义大，也可以入选，但要说清理由。',
      '5. 用词尽量自然、有判断，避免 AI 味太重。',
      '6. 整体读感要像一篇 HEO 风格的专题观察，不像新闻列表；优先制造“先看结论，再看展开”的阅读节奏。',
      '7. 开头与结尾都要有一句可以单独摘出来当卡片文案的强判断。',
      '8. 标题层级要服务目录导航，避免层级过深；正文尽量保持 H2 + H3 为主。',
      '9. 可以少量使用引用块承载核心判断，让页面更像专题文章。',
      '10. 文章必须让读者即使不逐段细看，也能通过标题、加粗句和 bullet 快速抓住重点。',
      '11. 每条三级标题都应尽量避免出现完整原标题原样照搬，而要把原标题翻译成一个更适合博客阅读的观点式标题。',
      '12. 正文里绝对不要出现“候选池”“素材池”“汇总链接”“内部来源”“系统输入”“提示词”等面向内部流程的措辞，要像作者直接在引用公开信息。',
      '13. 如果需要提到来源，请使用“公开信息显示”“原始来源显示”“相关项目/官方/作者提到”等自然表达；不要写“候选池提到”或“参考来源：候选池汇总链接”。',
      '14. 若某条信息只有聚合站链接而缺少原始项目链接，不要在正文中硬写“汇总链接”，而应改写为自然叙述，或使用更接近原始来源的公开链接。',

      '',
      '可参考的 AI 情报素材如下：',
      JSON.stringify(items, null, 2)

    ].join('\n')

    console.log('检测到 AI 接口配置，尝试生成正式日报内容...')
    try {
      markdown = await generateWithRetry({ apiUrl, apiKey, prompt })
      if (markdown) {
        generationMode = 'ai'
        generationStatus = 'success'
      }
    } catch (error) {
      generationWarning = String(error.message || '').trim()
      console.warn(`⚠️ AI 接口多次重试后仍失败，将生成模板降级稿但默认不发布：${generationWarning}`)
    }
  }


  if (!markdown) {
    console.log('未配置 AI 接口、AI 返回为空或接口异常，使用本地模板生成日报草稿。')
    markdown = buildDefaultMarkdown({ title, date: targetDate, items })
    generationMode = 'template-fallback'
    generationStatus = apiUrl && apiKey ? 'fallback_after_retry' : 'fallback_no_api'
  }



  markdown = injectItemImagesIntoMarkdown(markdown, items)

  const summary = extractSummaryFromMarkdown(markdown) || '今天最值得看的，不是某个模型参数更新，而是 AI 系统开始全面转向可执行、可治理、可持续运行的工程阶段。'

  const cover = process.env.AI_DAILY_DEFAULT_COVER || 'https://s41.ax1x.com/2026/03/23/peKAi7T.jpg'
  const payload = {

    title,
    slug,
    summary,
    tags: ['AI', '日报', '人工智能', '推荐'],
    status: 'Published',
    category: 'AI 情报',
    type: 'Post',
    icon: '🤖',
    cover,
    password: '',
    ai_summary: false,
    date: candidates.date || targetDate,
    markdown,
    sourceCount: items.length,
    generationMode,
    generationStatus,
    generationWarning,
    generatedAt: new Date().toISOString()
  }




  await ensureDir(path.dirname(postJsonFile))
  await fs.writeFile(postJsonFile, JSON.stringify(payload, null, 2), 'utf8')
  await fs.writeFile(postMdFile, markdown, 'utf8')

  console.log(`✅ 日报 JSON 已生成: ${postJsonFile}`)
  console.log(`✅ 日报 Markdown 已生成: ${postMdFile}`)
}

main().catch(error => {
  console.error('❌ 生成日报正文失败:', error.message)
  process.exit(1)
})
