import { isIterable } from '../../utils'

/**
 * 获取所有文章的标签
 * @param allPosts
 * @param sliceCount 默认截取数量为12，若为0则返回全部
 * @param categoryOptions categories的下拉选项
 * @returns {Promise<{}|*[]>}
 */

/**
 * 获取所有文章的分类
 * @param allPosts
 * @returns {Promise<{}|*[]>}
 */
export function getAllCategories({
  allPages,
  categoryOptions,
  sliceCount = 0
}) {
  const allPosts = allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )
  if (!allPosts || !categoryOptions) {
    return []
  }
  // 计数
  let categories = allPosts?.map(p => p.category)
  categories = [...categories.flat()]
  const categoryObj = {}
  categories.forEach(category => {
    if (!category) return
    if (category in categoryObj) {
      categoryObj[category]++
    } else {
      categoryObj[category] = 1
    }
  })
  const list = []
  if (isIterable(categoryOptions)) {
    for (const c of categoryOptions) {
      const name = typeof c?.value === 'string' ? c.value : ''
      const count = name ? categoryObj[name] : 0
      if (count && name) {
        list.push({
          id: c?.id || null,
          name,
          color: c?.color || null,
          count
        })
      }
    }
  }

  // 按照数量排序
  // list.sort((a, b) => b.count - a.count)
  if (sliceCount && sliceCount > 0) {
    return list.slice(0, sliceCount)
  } else {
    return list
  }
}
