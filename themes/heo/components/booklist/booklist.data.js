import { siteConfig } from '@/lib/config'
import CONFIG from '../../config'

const normalizeText = value => String(value || '').trim()
const buildBookHref = book => {
  const infoId = normalizeText(book?.infoId)
  if (infoId) return `https://weread.qq.com/web/reader/${infoId}`
  const href = normalizeText(book?.href)
  if (href) return href
  return book?.bookId ? `https://weread.qq.com/web/book/info?bookId=${book.bookId}` : ''
}

const dedupeByShelfName = sections => {
  const seen = new Set()
  return sections.filter(section => {
    const key = normalizeText(section?.shelfName).toLowerCase()
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const createSectionDescription = shelfName => `这里收录来自「${shelfName}」分组的书，保留我愿意公开展示的阅读痕迹。`

const compareByPreferredOrder = (a, b, orderMap) => {
  const aOrder = orderMap.get(normalizeText(a?.shelfName))
  const bOrder = orderMap.get(normalizeText(b?.shelfName))
  const safeA = Number.isFinite(aOrder) ? aOrder : Number.MAX_SAFE_INTEGER
  const safeB = Number.isFinite(bOrder) ? bOrder : Number.MAX_SAFE_INTEGER
  if (safeA !== safeB) return safeA - safeB
  return normalizeText(a?.shelfName).localeCompare(normalizeText(b?.shelfName), 'zh-Hans-CN')
}

export const getBookListPageConfig = siteInfo => {
  const profile = siteConfig('HEO_ABOUT_PROFILE', {}, CONFIG)
  const bookList = profile.bookList || {}
  const featuredShelfNames = Array.isArray(bookList.featuredShelfNames)
    ? bookList.featuredShelfNames.map(normalizeText).filter(Boolean)
    : []
  const sectionOrder = Array.isArray(bookList.sectionOrder)
    ? bookList.sectionOrder.map(normalizeText).filter(Boolean)
    : []

  return {
    hero: {
      badge: bookList.hero?.badge || 'Booklist',
      title: bookList.hero?.title || '我的书单',
      subtitle:
        bookList.hero?.subtitle ||
        '这里只展示我主动整理并愿意保留下来的书，不是完整书库，而是一份持续生长的阅读策展。',
      description:
        bookList.hero?.description ||
        '你可以把这里当作我的个人阅读空间：有长期偏爱的书，也有最近正在读、反复想起或阶段性特别想推荐的内容。',
      icon: bookList.hero?.icon || siteInfo?.icon || ''
    },
    stats: bookList.stats || [],
    featuredShelfNames,
    sectionOrder,
    sectionDescriptions: bookList.sectionDescriptions || {},
    emptyTitle: bookList.emptyTitle || '书单还在整理中',
    emptyDescription:
      bookList.emptyDescription ||
      '当前还没有读取到可展示的微信读书分组，稍后再来看看，或检查分组与同步配置是否已经就绪。',
    pagePath: bookList.pagePath || '/booklist',
    navLabel: bookList.navLabel || '我的书单'
  }
}

export const buildBookListSections = ({ shelfPayload, pageConfig }) => {
  const archive = Array.isArray(shelfPayload?.archive) ? shelfPayload.archive : []
  const books = Array.isArray(shelfPayload?.books) ? shelfPayload.books : []
  const bookMap = new Map(books.map(book => [normalizeText(book?.bookId), { ...book, href: buildBookHref(book) }]).filter(([bookId]) => bookId))

  const sections = archive
    .map(item => {
      const shelfName = normalizeText(item?.name)
      const shelfBooks = Array.isArray(item?.bookIds)
        ? item.bookIds.map(bookId => bookMap.get(normalizeText(bookId))).filter(Boolean)
        : []

      if (!shelfName || !shelfBooks.length) return null

      return {
        shelfName,
        title: shelfName,
        description: pageConfig.sectionDescriptions?.[shelfName] || createSectionDescription(shelfName),
        books: shelfBooks,
        count: shelfBooks.length,
        anchorId: `booklist-${encodeURIComponent(shelfName).replace(/%/g, '').toLowerCase()}`
      }
    })
    .filter(Boolean)

  const uniqueSections = dedupeByShelfName(sections)
  const preferredOrder = [...(pageConfig.featuredShelfNames || []), ...(pageConfig.sectionOrder || [])]
  const orderMap = new Map(preferredOrder.map((name, index) => [normalizeText(name), index]))
  const sortedSections = [...uniqueSections].sort((a, b) => compareByPreferredOrder(a, b, orderMap))
  const featuredShelfNames = pageConfig.featuredShelfNames || []
  const featuredSections = featuredShelfNames
    .map(name => sortedSections.find(section => section.shelfName === name))
    .filter(Boolean)
  const featuredKeys = new Set(featuredSections.map(section => section.shelfName))
  const otherSections = sortedSections.filter(section => !featuredKeys.has(section.shelfName))

  return {
    sections: sortedSections,
    featuredSections,
    otherSections,
    totalBooks: sortedSections.reduce((sum, section) => sum + section.count, 0)
  }
}

