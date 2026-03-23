const fs = require('fs/promises')
const path = require('path')
const { loadLocalEnv } = require('./load-local-env')

loadLocalEnv()

const ROOT = process.cwd()

const TEMP_DIR = path.join(ROOT, 'temp')
const DEFAULT_INPUT = path.join(TEMP_DIR, 'ai-daily-source-items.json')
const DEFAULT_OUTPUT = path.join(TEMP_DIR, 'ai-daily-candidates.json')

function normalizeDate(date = new Date()) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10)
}

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function toNumber(value, fallback = 0) {
  if (value === undefined || value === null) return fallback

  const normalized = String(value).trim()
  if (!normalized) return fallback

  const num = Number(normalized)
  return Number.isFinite(num) ? num : fallback
}


function normalizeSourceItem(item = {}) {
  const title = String(item.title || '').trim()
  const source = String(item.source || item.sourceName || '').trim()
  const url = String(item.url || item.link || '').trim()
  const summary = String(item.summary || item.description || '').trim()
  const category = String(item.category || '未分类').trim()
  const publishedAt = String(item.publishedAt || item.pubDate || item.date || '').trim()
  const credibility = Math.max(1, Math.min(5, toNumber(item.credibility, 3)))
  const developerValue = Math.max(1, Math.min(5, toNumber(item.developerValue, 3)))
  const industryImpact = Math.max(1, Math.min(5, toNumber(item.industryImpact, 3)))

  return {
    id: item.id || slugify(`${title}-${source}-${publishedAt || url}`),
    title,
    source,
    url,
    summary,
    category,
    publishedAt,
    sourceType: String(item.sourceType || 'unknown').trim(),
    sourceGroup: String(item.sourceGroup || '').trim(),
    sourceTier: String(item.sourceTier || '').trim(),
    groupPriority: toNumber(item.groupPriority, 999),
    credibility,
    developerValue,
    industryImpact,
    whyItMatters: String(item.whyItMatters || '').trim()
  }
}


function getTierBonus(item) {
  const tier = String(item.sourceTier || '').toLowerCase()
  if (tier === 'core') return 0.5
  if (tier === 'developer') return 0.3
  if (tier === 'media') return 0.05
  if (tier === 'debug') return -0.2
  return 0
}

function getSourceTypeBonus(item) {
  const sourceType = String(item.sourceType || '').toLowerCase()
  if (sourceType === 'official') return 0.25
  if (sourceType === 'media') return 0.05
  if (sourceType === 'local') return -0.1
  return 0
}

function getFreshnessBonus(item) {
  if (!item.publishedAt) return 0
  const published = new Date(item.publishedAt)
  if (Number.isNaN(published.getTime())) return 0
  const ageHours = (Date.now() - published.getTime()) / (60 * 60 * 1000)
  if (ageHours <= 6) return 0.2
  if (ageHours <= 12) return 0.1
  if (ageHours <= 24) return 0.05
  return 0
}

function getGroupPriorityBonus(item) {
  const priority = Math.max(1, toNumber(item.groupPriority, 999))
  if (priority <= 1) return 0.3
  if (priority <= 2) return 0.15
  if (priority <= 3) return 0.05
  return 0
}

function isRecentWithinHours(item, hours = 24) {

  if (!item.publishedAt) return true
  const published = new Date(item.publishedAt)
  if (Number.isNaN(published.getTime())) return true
  return Date.now() - published.getTime() <= hours * 60 * 60 * 1000
}

function selectCandidateWindow(items, preferredHours, fallbackHours) {
  const preferred = items.filter(item => isRecentWithinHours(item, preferredHours))
  if (preferred.length > 0) {
    return { items: preferred, appliedHoursWindow: preferredHours, usedFallbackWindow: false }
  }

  const fallback = items.filter(item => isRecentWithinHours(item, fallbackHours))
  return { items: fallback, appliedHoursWindow: fallbackHours, usedFallbackWindow: true }
}


function computeScore(item) {
  const baseScore = item.credibility * 0.35 + item.developerValue * 0.4 + item.industryImpact * 0.25
  const weightedScore = baseScore + getTierBonus(item) + getSourceTypeBonus(item) + getFreshnessBonus(item) + getGroupPriorityBonus(item)
  return Number(weightedScore.toFixed(2))
}



function dedupeItems(items) {
  const seen = new Map()

  for (const item of items) {
    if (!item.title) continue
    const key = slugify(item.title)
    const existing = seen.get(key)
    if (!existing || computeScore(item) > computeScore(existing)) {
      seen.set(key, item)
    }
  }

  return Array.from(seen.values())
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true })
}

async function loadSourceItems(inputFile) {
  const raw = await fs.readFile(inputFile, 'utf8')
  const parsed = JSON.parse(raw)
  const items = Array.isArray(parsed) ? parsed : parsed.items

  if (!Array.isArray(items)) {
    throw new Error('来源文件格式错误：应为数组或包含 items 数组')
  }

  return items.map(normalizeSourceItem)
}

async function main() {
  const inputFile = process.env.AI_DAILY_SOURCE_FILE || DEFAULT_INPUT
  const outputFile = process.env.AI_DAILY_CANDIDATES_FILE || DEFAULT_OUTPUT
  const maxItems = Math.max(1, toNumber(process.env.AI_DAILY_MAX_CANDIDATES, 12))
  const hoursWindow = Math.max(1, toNumber(process.env.AI_DAILY_HOURS_WINDOW, 24))
  const fallbackHoursWindow = Math.max(hoursWindow, toNumber(process.env.AI_DAILY_FALLBACK_HOURS_WINDOW, 168))
  const targetDate = normalizeDate()

  console.log('开始生成每日 AI 情报候选池...')
  console.log(`来源文件: ${inputFile}`)

  const sourceItems = await loadSourceItems(inputFile)
  const structured = sourceItems.filter(item => item.title && item.url)
  const { items: filtered, appliedHoursWindow, usedFallbackWindow } = selectCandidateWindow(
    structured,
    hoursWindow,
    fallbackHoursWindow
  )

  if (usedFallbackWindow) {
    console.log(`⚠️ 最近 ${hoursWindow} 小时内无有效候选，已自动回退到最近 ${fallbackHoursWindow} 小时窗口。`)
  }

  const deduped = dedupeItems(filtered)
    .map(item => ({ ...item, score: computeScore(item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxItems)

  const parsedInput = JSON.parse(await fs.readFile(inputFile, 'utf8'))
  const payload = {
    date: targetDate,
    generatedAt: new Date().toISOString(),
    sourceFile: inputFile,
    totalSourceItems: sourceItems.length,
    appliedHoursWindow,
    usedFallbackWindow,
    totalCandidates: deduped.length,
    alreadyPublishedToday: Boolean(parsedInput?.alreadyPublishedToday),
    shouldWaitForPrimary: Boolean(parsedInput?.shouldWaitForPrimary),
    activeSources: Array.isArray(parsedInput?.activeSources) ? parsedInput.activeSources : [],
    items: deduped
  }




  await ensureDir(path.dirname(outputFile))
  await fs.writeFile(outputFile, JSON.stringify(payload, null, 2), 'utf8')

  console.log(`✅ 候选池已生成: ${outputFile}`)
  console.log(`候选条目数: ${deduped.length}`)
}

main().catch(error => {
  console.error('❌ 生成候选池失败:', error.message)
  process.exit(1)
})
