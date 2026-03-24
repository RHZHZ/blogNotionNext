import { siteConfig } from '@/lib/config'
import { compressImage, mapImgUrl } from '@/lib/db/notion/mapImage'
import { isBrowser, loadExternalResource } from '@/lib/utils'
import mediumZoom from '@fisch0920/medium-zoom'
import 'katex/dist/katex.min.css'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { NotionRenderer } from 'react-notion-x'
import InlineIslandAudio from '@/components/InlineIslandAudio'
import ReactDOM from 'react-dom/client'

/**
 * 整个站点的核心组件
 * 将Notion数据渲染成网页
 * @param {*} param0
 * @returns
 */
export const applyImageGalleryLayoutToArticle = ({ article, width }) => {
  if (!article) return

  const rows = article.querySelectorAll('.notion-row')

  rows.forEach(row => {
    row.classList.remove('heo-image-gallery-row', 'heo-article-block', 'heo-article-block--gallery')
    row.style.removeProperty('--heo-gallery-cols')
    row.style.removeProperty('--heo-gallery-gap')
    row.style.removeProperty('--heo-gallery-stack-max')
    if (row.dataset.heoBlock === 'gallery') {
      delete row.dataset.heoBlock
    }
    delete row.dataset.heoGallery
    delete row.dataset.heoGalleryCount
    delete row.dataset.heoGalleryCols
    delete row.dataset.heoGalleryImageCount
    delete row.dataset.heoGalleryPattern
    delete row.dataset.heoGalleryMixed
    delete row.dataset.heoGalleryStackedColumn

    const columns = Array.from(row.children).filter(child =>
      child.classList?.contains('notion-column')
    )

    if (columns.length < 2) return

    const columnImageCounts = columns.map(column =>
      column.querySelectorAll(':scope > figure.notion-asset-wrapper-image').length
    )

    const hasEmptyColumn = columnImageCounts.some(count => count === 0)
    if (hasEmptyColumn) return

    const totalImages = columnImageCounts.reduce((sum, count) => sum + count, 0)
    const maxImagesInColumn = Math.max(...columnImageCounts)
    const stackedColumnIndex = columnImageCounts.findIndex(count => count > 1)
    const desiredCols = width >= 1440 ? 4 : width >= 1024 ? 3 : 2
    const actualCols = Math.min(desiredCols, columns.length)
    const galleryGap = width >= 1024 ? '0.75rem' : width >= 768 ? '0.5rem' : '0.45rem'
    const isMixedStack = stackedColumnIndex !== -1 && columns.length === 2
    const stackedColumnSide =
      stackedColumnIndex === -1 ? '' : stackedColumnIndex === 0 ? 'left' : 'right'

    row.classList.add('heo-image-gallery-row')
    row.dataset.heoGalleryCount = String(columns.length)
    row.dataset.heoGalleryCols = String(actualCols)
    row.dataset.heoGalleryImageCount = String(totalImages)
    row.dataset.heoGalleryPattern = isMixedStack ? 'mixed-stack' : 'uniform-grid'
    row.dataset.heoGalleryMixed = isMixedStack ? 'true' : 'false'
    row.dataset.heoGalleryStackedColumn = stackedColumnSide
    row.style.setProperty('--heo-gallery-cols', String(actualCols))
    row.style.setProperty('--heo-gallery-gap', galleryGap)

    if (maxImagesInColumn > 1) {
      row.style.setProperty('--heo-gallery-stack-max', String(maxImagesInColumn))
    }
  })
}


export const applyArticleMediaDecorations = article => {
  if (!article) return

  article.querySelectorAll('.notion-blank').forEach(node => {
    if (node.children.length > 0) return

    const text = (node.textContent || '').replace(/\u00a0/g, '').trim()
    if (!text) {
      node.remove()
    }
  })

  article.dataset.heoReadingSurface = 'true'
  article.dataset.heoArticleSurface = 'article'
  article.classList.add('heo-article-surface')

  const markBlocks = (selector, type, onMatch) => {
    article.querySelectorAll(selector).forEach((node, index) => {
      node.classList.add('heo-article-block', `heo-article-block--${type}`)
      node.dataset.heoBlock = type
      onMatch?.(node, index)
    })
  }

  markBlocks('figure.notion-asset-wrapper-image', 'image', node => {
    const caption = node.nextElementSibling
    if (caption?.classList?.contains('notion-asset-caption')) {
      caption.classList.add('heo-article-caption')
      caption.dataset.heoCaptionFor = 'image'
    }
  })
  markBlocks('.notion-row.heo-image-gallery-row', 'gallery', node => {
    node.dataset.heoGallery = 'true'
  })
  markBlocks('.notion-audio', 'audio')
  markBlocks('pre.notion-code', 'code')
  markBlocks('blockquote, .notion-quote', 'quote')
  markBlocks('.notion-callout', 'callout')
  markBlocks('.notion-bookmark', 'bookmark')
  markBlocks('.notion-pdf', 'pdf')
  markBlocks('.notion-asset-wrapper iframe', 'embed', node => {
    const wrapper = node.closest('.notion-asset-wrapper') || node.parentElement
    if (wrapper) {
      wrapper.classList.add('heo-article-block', 'heo-article-block--embed')
      wrapper.dataset.heoBlock = 'embed'
    }
  })
}

export const applyArticleReadingEnhancements = ({ article, width }) => {
  if (!article) return

  applyImageGalleryLayoutToArticle({ article, width })
  applyArticleMediaDecorations(article)
}

const NotionPage = ({ post, className }) => {
  // 是否关闭数据库和画册的点击跳转
  const POST_DISABLE_GALLERY_CLICK = siteConfig('POST_DISABLE_GALLERY_CLICK')
  const POST_DISABLE_DATABASE_CLICK = siteConfig('POST_DISABLE_DATABASE_CLICK')
  const SPOILER_TEXT_TAG = siteConfig('SPOILER_TEXT_TAG')

  // 文章音频转换配置
  const ARTICLE_AUDIO_CONVERT = siteConfig('MUSIC_PLAYER_ARTICLE_AUDIO_CONVERT', true)
  const ARTICLE_META_ENABLE = siteConfig('MUSIC_PLAYER_ARTICLE_META_ENABLE', true)

  const zoom =
    isBrowser &&
    mediumZoom({
      //   container: '.notion-viewport',
      background: 'rgba(0, 0, 0, 0.2)',
      margin: getMediumZoomMargin()
    })

  const zoomRef = useRef(zoom ? zoom.clone() : null)
  const IMAGE_ZOOM_IN_WIDTH = siteConfig('IMAGE_ZOOM_IN_WIDTH', 1200)

  // 灵动岛音频转换逻辑
  useEffect(() => {
    if (!ARTICLE_AUDIO_CONVERT) return

    const timer = setTimeout(() => {
      convertArticleAudios({ ARTICLE_META_ENABLE })
    }, 1000)

    return () => clearTimeout(timer)
  }, [post, ARTICLE_AUDIO_CONVERT, ARTICLE_META_ENABLE])

  // 页面首次打开时执行的勾子
  useEffect(() => {
    // 检测当前的url并自动滚动到对应目标
    autoScrollToHash()
  }, [])

  // 页面文章发生变化时会执行的勾子
  useEffect(() => {
    // 相册视图点击禁止跳转，只能放大查看图片
    if (POST_DISABLE_GALLERY_CLICK) {
      // 针对页面中的gallery视图，点击后是放大图片还是跳转到gallery的内部页面
      processGalleryImg(zoomRef?.current)
    }

    // 页内数据库点击禁止跳转，只能查看
    if (POST_DISABLE_DATABASE_CLICK) {
      processDisableDatabaseUrl()
    }

    /**
     * 放大查看图片时替换成高清图像
     */
    const observer = new MutationObserver(mutationsList => {
      mutationsList.forEach(mutation => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          if (mutation.target.classList.contains('medium-zoom-image--opened')) {
            // 等待动画完成后替换为更高清的图像
            setTimeout(() => {
              // 获取该元素的 src 属性
              const src = mutation?.target?.getAttribute('src')
              //   替换为更高清的图像
              mutation?.target?.setAttribute(
                'src',
                compressImage(src, IMAGE_ZOOM_IN_WIDTH)
              )
            }, 800)
          }
        }
      })
    })

    // 监视页面元素和属性变化
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class']
    })

    return () => {
      observer.disconnect()
    }
  }, [post])

  useEffect(() => {
    if (!isBrowser) return

    const enhanceArticleReading = () => {
      const article = document.getElementById('notion-article')
      if (!article) return

      applyArticleReadingEnhancements({
        article,
        width: window.innerWidth
      })
    }

    const timer = setTimeout(enhanceArticleReading, 80)
    const target = document.getElementById('notion-article') || document.body
    const observer = new MutationObserver(() => enhanceArticleReading())
    observer.observe(target, {
      childList: true,
      subtree: true
    })
    window.addEventListener('resize', enhanceArticleReading)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
      window.removeEventListener('resize', enhanceArticleReading)
    }
  }, [post])

  useEffect(() => {
    // Spoiler文本功能
    if (SPOILER_TEXT_TAG) {
      import('lodash/escapeRegExp').then(escapeRegExp => {
        Promise.all([
          loadExternalResource('/js/spoilerText.js', 'js'),
          loadExternalResource('/css/spoiler-text.css', 'css')
        ]).then(() => {
          window.textToSpoiler &&
            window.textToSpoiler(escapeRegExp.default(SPOILER_TEXT_TAG))
        })
      })
    }

    // 查找所有具有 'notion-collection-page-properties' 类的元素,删除notion自带的页面properties
    const timer = setTimeout(() => {
      // 查找所有具有 'notion-collection-page-properties' 类的元素
      const elements = document.querySelectorAll(
        '.notion-collection-page-properties'
      )

      // 遍历这些元素并将其从 DOM 中移除
      elements?.forEach(element => {
        element?.remove()
      })
    }, 1000) // 1000 毫秒 = 1 秒

    // 清理定时器，防止组件卸载时执行
    return () => clearTimeout(timer)
  }, [post])


  return (
    <div
      id='notion-article'
      data-heo-reading-surface='true'
      className={`mx-auto overflow-hidden ${className || ''}`}>
      {post?.blockMap?.block ? (
        <NotionRenderer
          recordMap={post?.blockMap}
          mapPageUrl={mapPageUrl}
          mapImageUrl={mapImgUrl}
          components={{
            Code,
            Collection,
            Equation,
            Modal,
            Pdf,
            Tweet,
            Audio: InlineIslandAudio
          }}
        />
      ) : null}

      <AdEmbed />
      <PrismMac />
    </div>
  )
}

const normalizeArticleAudioKey = url => {
  try {
    return decodeURIComponent(url.split('?')[0].split('/').pop() || '')
  } catch {
    return url.split('?')[0].split('/').pop() || ''
  }
}

const buildArticleAudioKeyVariants = rawValue => {
  const normalized = normalizeArticleAudioKey(rawValue)
  if (!normalized) return []

  const variants = new Set([normalized])
  const withoutExt = normalized.replace(/\.[a-z0-9]{1,8}$/i, '')
  if (withoutExt && withoutExt !== normalized) {
    variants.add(withoutExt)
  }

  return Array.from(variants)
}

const resolveArticleAudioMeta = ({ metaMap, audioKey }) => {
  if (!metaMap || !audioKey) return null

  return buildArticleAudioKeyVariants(audioKey)
    .map(key => metaMap[key] || metaMap?.byAudioKey?.[key] || null)
    .find(Boolean) || null
}

const logArticleAudioMetaFallback = ({ reason, audioKey, url }) => {
  if (process.env.NODE_ENV === 'production') return

  console.info('[ArticleAudioMeta] fallback to inline audio card', {
    reason,
    audioKey,
    url
  })
}

const getArticleAudioDefaultTitle = block => {
  return (
    block.closest('.notion-column')?.innerText ||
    block.previousElementSibling?.innerText ||
    '文章音频'
  )
}

const fetchArticleAudioMetaMap = async ARTICLE_META_ENABLE => {
  if (!ARTICLE_META_ENABLE) {
    console.info('[ArticleAudioMeta] metadata fetch skipped because feature is disabled')
    return {}
  }

  try {
    const res = await fetch('/api/audio-meta')
    if (!res.ok) {
      console.warn('[ArticleAudioMeta] metadata fetch returned non-ok response', {
        status: res.status
      })
      return {}
    }
    return await res.json()
  } catch (error) {
    console.error('[ArticleAudioMeta] metadata fetch failed', error)
    return {}
  }
}

const mountInlineIslandAudio = ({ block, audioTag, url, meta }) => {
  if (!block || !audioTag || !url) return

  if (typeof window !== 'undefined' && meta?.isPodcast) {
    const detail = {
      url,
      resolvedUrl: meta.archivedAudioUrl || meta.rawUrl || url,
      title: meta.name || getArticleAudioDefaultTitle(block),
      artist: meta.artist || '',
      cover: meta.cover || '',
      description: meta.pcDescription || '',
      lrc: meta.lrc || '',
      isPodcast: true
    }

    window.__HEO_LAST_PODCAST_META__ = detail
    window.dispatchEvent(
      new CustomEvent('heo-podcast-meta-ready', {
        detail
      })
    )
  }

  const existingContainer = block.querySelector(':scope > [data-inline-island-audio="true"]')
  if (existingContainer?.dataset?.mounted === 'true') {
    block.classList.add('island-converted')
    audioTag.style.display = 'none'
    return
  }

  block.classList.add('island-converted')
  audioTag.style.display = 'none'

  const container = existingContainer || document.createElement('div')
  container.dataset.inlineIslandAudio = 'true'
  container.dataset.mounted = 'true'
  container.dataset.heoBlock = 'audio-player'
  container.classList.add('heo-inline-audio-mount')

  block.classList.add('heo-article-block', 'heo-article-block--audio')
  block.dataset.heoBlock = 'audio'


  if (!existingContainer) {
    block.appendChild(container)
  }

  const root = ReactDOM.createRoot(container)
  root.render(
    <InlineIslandAudio
      url={url}
      title={meta.name || getArticleAudioDefaultTitle(block)}
      artist={meta.artist}
      cover={meta.cover}
      lrc={meta.lrc}
      album={meta.album}
      isPodcast={Boolean(meta.isPodcast)}
      description={meta.pcDescription || ''}
    />
  )
}

const convertArticleAudios = async ({
  ARTICLE_META_ENABLE,
  enableOnDemandMetaLookup = false,
  resolveMetaByKey = fetchArticleAudioMetaByKey
}) => {
  const metaMap = await fetchArticleAudioMetaMap(ARTICLE_META_ENABLE)
  const audioBlocks = document.querySelectorAll('.notion-audio:not(.island-converted)')

  for (const block of audioBlocks) {
    const audioTag = block.querySelector('audio')
    if (!audioTag?.src) continue

    const url = audioTag.src
    const audioKey = normalizeArticleAudioKey(url)
    let meta = resolveArticleAudioMeta({ metaMap, audioKey })

    if (!meta && enableOnDemandMetaLookup) {
      meta = await resolveMetaByKey({ ARTICLE_META_ENABLE, audioKey })
    }

    if (!meta) {
      logArticleAudioMetaFallback({
        reason: ARTICLE_META_ENABLE ? 'meta_missing' : 'meta_disabled',
        audioKey,
        url
      })
    }

    mountInlineIslandAudio({ block, audioTag, url, meta: meta || {} })
  }
}

const fetchArticleAudioMetaByKey = async ({ ARTICLE_META_ENABLE, audioKey }) => {
  if (!audioKey) return null

  const metaMap = await fetchArticleAudioMetaMap(ARTICLE_META_ENABLE)
  return resolveArticleAudioMeta({ metaMap, audioKey })
}

/**
 * 页面的数据库链接禁止跳转，只能查看
 */
const processDisableDatabaseUrl = () => {
  if (isBrowser) {
    const links = document.querySelectorAll('.notion-table a')
    for (const e of links) {
      e.removeAttribute('href')
    }
  }
}

/**
 * gallery视图，点击后是放大图片还是跳转到gallery的内部页面
 */
const processGalleryImg = zoom => {
  setTimeout(() => {
    if (isBrowser) {
      const imgList = document?.querySelectorAll(
        '.notion-collection-card-cover img'
      )
      if (imgList && zoom) {
        for (let i = 0; i < imgList.length; i++) {
          zoom.attach(imgList[i])
        }
      }

      const cards = document.getElementsByClassName('notion-collection-card')
      for (const e of cards) {
        e.removeAttribute('href')
      }
    }
  }, 800)
}

/**
 * 根据url参数自动滚动到锚位置
 */
const autoScrollToHash = () => {
  setTimeout(() => {
    // 跳转到指定标题
    const hash = window?.location?.hash
    const needToJumpToTitle = hash && hash.length > 0
    if (needToJumpToTitle) {
      console.log('jump to hash', hash)
      const tocNode = document.getElementById(hash.substring(1))
      if (tocNode && tocNode?.className?.indexOf('notion') > -1) {
        tocNode.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }
    }
  }, 180)
}

/**
 * 将id映射成博文内部链接。
 * @param {*} id
 * @returns
 */
const mapPageUrl = id => {
  if (!id) return '/'
  // return 'https://www.notion.so/' + id.replace(/-/g, '')
  return '/' + id.replace(/-/g, '')
}

/**
 * 缩放
 * @returns
 */
function getMediumZoomMargin() {
  const width = window.innerWidth

  if (width < 500) {
    return 8
  } else if (width < 800) {
    return 20
  } else if (width < 1280) {
    return 30
  } else if (width < 1600) {
    return 40
  } else if (width < 1920) {
    return 48
  } else {
    return 72
  }
}

// 代码
const Code = dynamic(
  () =>
    import('react-notion-x/build/third-party/code').then(m => {
      return m.Code
    }),
  { ssr: false }
)

// 公式
const Equation = dynamic(
  () =>
    import('@/components/Equation').then(async m => {
      // 化学方程式
      await import('@/lib/plugins/mhchem')
      return m.Equation
    }),
  { ssr: false }
)

// 原版文档
// const Pdf = dynamic(
//   () => import('react-notion-x/build/third-party/pdf').then(m => m.Pdf),
//   {
//     ssr: false
//   }
// )
const Pdf = dynamic(() => import('@/components/Pdf').then(m => m.Pdf), {
  ssr: false
})

// 美化代码 from: https://github.com/txs
const PrismMac = dynamic(() => import('@/components/PrismMac'), {
  ssr: false
})

/**
 * tweet嵌入
 */
const TweetEmbed = dynamic(() => import('react-tweet-embed'), {
  ssr: false
})

/**
 * 文内google广告
 */
const AdEmbed = dynamic(
  () => import('@/components/GoogleAdsense').then(m => m.AdEmbed),
  { ssr: true }
)

const Collection = dynamic(
  () =>
    import('react-notion-x/build/third-party/collection').then(
      m => m.Collection
    ),
  {
    ssr: true
  }
)

const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then(m => m.Modal),
  { ssr: false }
)

const Tweet = ({ id }) => {
  return <TweetEmbed tweetId={id} />
}

export default NotionPage
