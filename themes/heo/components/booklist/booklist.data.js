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
      badge: bookList.hero?.badge || '阅读清单',
      title: bookList.hero?.title || '我的书单',
      subtitle:
        bookList.hero?.subtitle ||
        '这里放的不是完整书库，而是我愿意留下来、也确实想继续回看的那部分阅读记录。',
      description:
        bookList.hero?.description ||
        '有些书是最近在读，有些是反复重翻，还有些只是某个阶段刚好特别想记下来。总之，先按分组慢慢看。',
      icon: bookList.hero?.icon || siteInfo?.icon || ''
    },
    stats: bookList.stats || [],
    featuredShelfNames,
    sectionOrder,
    sectionDescriptions: bookList.sectionDescriptions || {},
    emptyTitle: bookList.emptyTitle || '这页书单还没准备好',
    emptyDescription:
      bookList.emptyDescription ||
      '暂时还没有读到可展示的分组数据，你可以晚点再来看，或者先检查一下微信读书同步配置。',
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

