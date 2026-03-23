const fs = require('fs/promises')
const path = require('path')
const { loadLocalEnv } = require('./load-local-env')

loadLocalEnv()

const ROOT = process.cwd()

const TEMP_DIR = path.join(ROOT, 'temp')
const DEFAULT_CANDIDATES_FILE = path.join(TEMP_DIR, 'ai-daily-candidates.json')
const DEFAULT_POST_JSON = path.join(TEMP_DIR, 'ai-daily-post.json')
const DEFAULT_POST_MD = path.join(TEMP_DIR, 'ai-daily-post.md')

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

function buildDefaultMarkdown({ title, items }) {

  const topItems = items.slice(0, 6)
  const sections = topItems.map((item, index) => {
    const whyItMatters = item.whyItMatters || '这一更新具备较高的信息增量，值得后续持续关注。'
    return [`### ${index + 1}. ${item.title}`,
      `- **一句话摘要**：${item.summary || '待补充摘要'}`,
      '- **核心信息**：',
      `  - 来源：${item.source || '未知来源'}`,
      `  - 类别：${item.category || '未分类'}`,
      item.publishedAt ? `  - 发布时间：${item.publishedAt}` : '  - 发布时间：待补充',
      `- **为什么值得关注**：${whyItMatters}`,
      `- **来源**：${item.url || '待补充'}`].join('\n')
  })

  return [
    `# ${title}`,
    '',
    '> RHZ 为你筛选今天最值得关注的 AI 新动态。',
    '',
    '## 今日总览',
    `今天的 AI 信息面主要集中在模型更新、产品迭代与开发者工具演进。以下内容基于最近 24 小时候选情报筛选而成，优先保留原始来源和对开发者有实际价值的信息。`,
    '',
    '## 今日重点情报',
    '',
    sections.join('\n\n'),
    '',
    '## 开发者特别关注',
    '- **模型 / API**：关注哪些能力真正开放给开发者使用。',
    '- **开源 / 工具链**：关注是否有可直接落地的新工具或工作流。',
    '- **产品化进展**：关注新能力是否已经进入实际使用场景。',
    '',
    '## 今天透露出的 3 个趋势',
    '- **趋势 1**：模型能力更新正更快转化为产品能力。',
    '- **趋势 2**：开发者工具和 Agent 工作流持续成为竞争焦点。',
    '- **趋势 3**：真正值得关注的是可落地性，而不是单纯概念发布。',
    '',
    '## RHZ 简评',
    '今天更值得注意的不是“又多了几条新闻”，而是哪些变化已经开始影响开发者工具链与实际使用体验。日报应该尽量保持克制：少写重复信息，多写真正有增量的内容。',
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

async function main() {
  const candidatesFile = process.env.AI_DAILY_CANDIDATES_FILE || DEFAULT_CANDIDATES_FILE
  const postJsonFile = process.env.AI_DAILY_POST_JSON || DEFAULT_POST_JSON
  const postMdFile = process.env.AI_DAILY_POST_MD || DEFAULT_POST_MD
  const targetDate = normalizeDate()

  console.log('开始生成每日 AI 情报正文...')
  console.log(`候选池文件: ${candidatesFile}`)

  const candidates = await readJson(candidatesFile)
  const items = Array.isArray(candidates.items) ? candidates.items : []

  if (!items.length) {
    throw new Error('候选池为空，无法生成日报正文')
  }

  const title = `每日 AI 情报｜${candidates.date || targetDate}`
  const slug = `daily-ai-news-${candidates.date || targetDate}`
  let markdown = ''

  const apiUrl = process.env.AI_DAILY_API || process.env.AI_SUMMARY_API || ''
  const apiKey = process.env.AI_DAILY_KEY || process.env.AI_SUMMARY_KEY || ''

  if (apiUrl && apiKey) {
    const prompt = [
      `请根据下面的 AI 情报候选池，为 ${title} 生成一篇适合直接发布到 RHZ 博客的中文 Markdown 长文。`,
      '',
      '写作目标：',
      '1. 不是简单汇总，而是帮读者快速判断今天真正值得看的变化。',
      '2. 文章要有“读下去的欲望”，开头先给结论和张力，再展开。',
      '3. 风格像个人技术博客，不像门户资讯站。',
      '4. 面向开发者，但也要照顾普通科技读者的理解成本。',
      '',
      '结构要求：',
      '1. 仅输出 Markdown。',
      '2. 不要再输出文章总标题，因为页面已有标题。',
      '3. 只使用这些 Markdown 结构：##、###、普通段落、- 无序列表、1. 编号列表、> 引用、--- 分隔线、**加粗**、Markdown 链接。不要使用表格、代码块、HTML、自定义标签。',
      '4. 必须包含这些二级标题：今日总览、今天最值得看的 5-7 条、开发者视角、今天的判断、RHZ 简评。',
      '5. 在“今日总览”里，先用 1 段给出今天的主判断，再用 3 条 bullet 写“3 个核心判断”，每条都要短、狠、明确。',
      '6. 在“今天最值得看的 5-7 条”下面，每条都用三级标题，标题要有观点性，不要只是复述原标题。',
      '7. 每条三级标题下面第一段必须先给一句结论式开场，让读者一眼知道这条为什么值得读。',
      '8. 每条内容至少包含三小段：发生了什么、为什么现在值得关注、这会影响谁。',
      '9. 多用短段落，避免大段密集文本。',
      '10. 可以有少量 bullet 或编号列表，但不要整篇都变成列表。',
      '11. 每个大章节之间可以用 --- 分隔，但不要滥用。',
      '12. 结尾要有总结判断，收住全文。',
      '',
      '内容要求：',
      '1. 优先选择开发者价值高、信息增量大的候选，不要把明显偏泛资讯的内容写成重点。',
      '2. 允许引用原始来源名称和链接，但不要让链接喧宾夺主。',
      '3. 不要使用“为什么值得关注：”这种生硬模板标签，直接写自然段。',
      '4. 如果某条信息不够硬核但行业意义大，也可以入选，但要说清理由。',
      '5. 用词尽量自然、有判断，避免 AI 味太重。',
      '6. 整体读感要像一篇 HEO 风格的专题观察，不像新闻列表；优先制造“先看结论，再看展开”的阅读节奏。',
      '7. 开头与结尾都要有一句可以单独摘出来当卡片文案的强判断。',
      '8. 标题层级要服务目录导航，避免层级过深；正文尽量保持 H2 + H3 为主。',
      '9. 可以少量使用引用块承载核心判断，让页面更像专题文章。',
      '',
      '候选池如下：',
      JSON.stringify(items, null, 2)
    ].join('\n')

    console.log('检测到 AI 接口配置，尝试生成正式日报内容...')
    markdown = await generateWithApi({ apiUrl, apiKey, prompt })
  }


  if (!markdown) {
    console.log('未配置 AI 接口或 AI 返回为空，使用本地模板生成日报草稿。')
    markdown = buildDefaultMarkdown({ title, date: targetDate, items })
  }

  const summary = extractSummaryFromMarkdown(markdown) || '今天最值得看的，不是某个模型参数更新，而是 AI 系统开始全面转向可执行、可治理、可持续运行的工程阶段。'
  const payload = {

    title,
    slug,
    summary,
    tags: ['AI', '日报', '人工智能'],
    status: 'Published',
    category: 'AI 情报',
    type: 'Post',
    icon: '🤖',
    password: '',
    ai_summary: true,
    date: candidates.date || targetDate,
    markdown,
    sourceCount: items.length,
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
