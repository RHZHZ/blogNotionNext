import { useEffect, useMemo, useState } from 'react'

import { HashTag } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import WordCount from '@/components/WordCount'
import { siteConfig } from '@/lib/config'
import { formatDateFmt } from '@/lib/utils/formatDate'
import SmartLink from '@/components/SmartLink'
import WavesArea from './WavesArea'

/**
 * 文章页头
 * @param {*} param0
 * @returns
 */
export default function PostHeader({ post, siteInfo, isDarkMode }) {
  if (!post) {
    return <></>
  }
  // 文章头图
  const headerImage = post?.pageCover ? post.pageCover : siteInfo?.pageCover
  const ANALYTICS_BUSUANZI_ENABLE = siteConfig('ANALYTICS_BUSUANZI_ENABLE')

  const fallbackBgColor = useMemo(() => {
    return isDarkMode ? '#CA8A04' : '#0060e0'
  }, [isDarkMode])

  const [headerBgColor, setHeaderBgColor] = useState(fallbackBgColor)

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (!headerImage) {
        setHeaderBgColor(fallbackBgColor)
        return
      }

      const color = await getDarkDominantColorFromImageUrl(headerImage, {
        fallback: fallbackBgColor,
        darkenRatio: 0.62,
        maxSize: 48
      })

      if (!cancelled) {
        setHeaderBgColor(color)
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [headerImage, fallbackBgColor])

  const coverShadowColor = useMemo(() => {
    return adjustColor(headerBgColor, { lightenRatio: 0.12 })
  }, [headerBgColor])

  const visibleTags = post?.tagItems?.slice(0, 4) || []
  const postTitleIcon = useMemo(
    () => getPostHeaderTitleIcon(post?.pageIcon),
    [post?.pageIcon]
  )


  useEffect(() => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    root.style.setProperty('--heo-cover-color', headerBgColor)
    root.style.setProperty('--heo-cover-shadow-color', coverShadowColor)

    window.dispatchEvent(
      new CustomEvent('heo-cover-color-change', {
        detail: { color: headerBgColor, shadow: coverShadowColor }
      })
    )
  }, [headerBgColor, coverShadowColor])

  return (
    <div
      id='post-bg'
      className='relative z-10 mb-0 w-full overflow-hidden bg-cover bg-center bg-no-repeat md:mb-0 md:flex-shrink-0 min-h-[19rem] sm:min-h-[21rem] lg:min-h-[25rem]'>
      <style jsx>{`
        .coverdiv:after {
          position: absolute;
          content: '';
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(15, 23, 42, 0.16) 0%,
            rgba(15, 23, 42, 0.22) 24%,
            rgba(15, 23, 42, 0.52) 68%,
            rgba(15, 23, 42, 0.78) 100%
          );
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08) inset,
            0 -110px 220px -120px ${coverShadowColor} inset;
        }
      `}</style>

      <div
        style={{ backgroundColor: headerBgColor }}
        className='absolute inset-0 flex items-stretch justify-center overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_46%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(15,23,42,0.22)_58%,rgba(15,23,42,0.38))]' />

        {headerImage && (
          <div
            id='post-cover-wrapper'
            style={{
              filter: 'blur(10px)'
            }}
            className='coverdiv absolute inset-y-0 right-[-8%] w-[88%] opacity-45 scale-105 sm:right-[-4%] sm:w-[78%] sm:opacity-50 lg:right-[-2%] lg:w-[66%] lg:translate-x-12 lg:rotate-3'>
            <LazyImage
              id='post-cover'
              className='h-full w-full object-cover min-h-[20rem]'
              src={headerImage}
            />
          </div>
        )}

        <div className='relative z-10 flex min-h-inherit w-full items-start'>
          <div
            id='post-bg-content'
            className='mx-auto flex w-full max-w-[86rem] px-4 sm:px-6 lg:px-8'>
            <div
              id='post-info'
              className='w-full max-w-[72rem] rounded-[1.5rem] bg-white/8 p-4 text-white shadow-[0_20px_70px_rgba(15,23,42,0.16)] backdrop-blur-[14px] sm:rounded-[1.75rem] sm:p-5 lg:rounded-[2rem] lg:p-8'>

              <div className='post-info-inner flex flex-col gap-4'>
                <div className='post-info-head'>
                  <div className='post-info-eyebrow flex flex-wrap items-center justify-center gap-2.5 md:justify-start'>
                    {post.category && (
                      <SmartLink
                        href={`/category/${post.category}`}
                        className='inline-flex items-center rounded-full border border-white/18 bg-white/14 px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/92 transition duration-200 hover:bg-white/22 hover:text-white'>
                        {post.category}
                      </SmartLink>
                    )}

                    {visibleTags.length > 0 && (
                      <div className='hidden flex-wrap items-center gap-2 md:flex'>
                        {visibleTags.map((tag, index) => (
                          <SmartLink
                            key={index}
                            href={`/tag/${encodeURIComponent(tag.name)}`}
                            className='inline-flex items-center rounded-full border border-white/10 bg-black/10 px-2.5 py-1 text-xs font-medium text-white/78 transition duration-200 hover:border-white/20 hover:bg-white/12 hover:text-white'>
                            <HashTag className='mr-1 h-3 w-3 stroke-2 text-white/60' />
                            {tag.name}
                          </SmartLink>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className='post-info-title-zone'>
                  <div className='post-info-title-wrap max-w-4xl text-center md:text-left'>
                    <div className='post-info-title-row inline-flex items-start justify-center md:justify-start'>
                      <div className='post-info-title text-[2rem] leading-[1.2] text-white drop-shadow-[0_10px_30px_rgba(15,23,42,0.28)] sm:text-[2.4rem] lg:text-[3.45rem] lg:leading-[1.12]'>
                        {siteConfig('POST_TITLE_ICON') && postTitleIcon && (
                          <span className='post-info-title-icon inline-flex translate-y-[0.08em] items-center text-[0.92em]'>
                            <NotionIcon icon={postTitleIcon} />
                          </span>
                        )}

                        <span className='post-info-title-text' title={post.title}>
                          {post.title}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='post-info-meta-zone'>
                  <section className='post-info-meta flex flex-wrap items-center justify-center gap-2.5 text-center md:justify-start md:text-left'>
                    <div className='inline-flex min-h-[2.5rem] items-center rounded-full border border-white/12 bg-black/12 px-3.5 py-2 text-sm font-medium text-white/78'>
                      <WordCount
                        wordCount={post.wordCount}
                        readTime={post.readTime}
                      />
                    </div>

                    {post?.type !== 'Page' && (
                      <SmartLink
                        href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
                        passHref
                        className='inline-flex min-h-[2.5rem] items-center rounded-full border border-white/12 bg-black/12 px-3.5 py-2 text-sm font-medium text-white/78 transition duration-200 hover:border-white/24 hover:bg-white/12 hover:text-white'>
                        <i className='fa-regular fa-calendar mr-2' />
                        {post?.publishDay}
                      </SmartLink>
                    )}

                    <div className='inline-flex min-h-[2.5rem] items-center rounded-full border border-white/12 bg-black/12 px-3.5 py-2 text-sm font-medium text-white/72'>
                      <i className='fa-regular fa-calendar-check mr-2' />
                      {post.lastEditedDay}
                    </div>

                    {ANALYTICS_BUSUANZI_ENABLE && (
                      <div className='busuanzi_container_page_pv inline-flex min-h-[2.5rem] items-center rounded-full border border-white/12 bg-black/12 px-3.5 py-2 text-sm font-medium text-white/72'>
                        <i className='fa-solid fa-fire-flame-curved mr-2' />
                        <span className='mr-1'>热度</span>
                        <span className='busuanzi_value_page_pv' />
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>

        <WavesArea />
      </div>
    </div>
  )
}

function getPostHeaderTitleIcon(icon) {
  if (typeof icon !== 'string') return ''

  const normalizedIcon = icon.trim()
  if (!normalizedIcon) return ''

  return normalizedIcon.startsWith('http') || normalizedIcon.startsWith('data:')
    ? normalizedIcon
    : ''
}

function clampInt(v, min, max) {

  return Math.max(min, Math.min(max, Math.round(v)))
}

function parseHexColor(hex) {
  const raw = String(hex || '').trim().replace('#', '')
  if (raw.length === 3) {
    const r = parseInt(raw[0] + raw[0], 16)
    const g = parseInt(raw[1] + raw[1], 16)
    const b = parseInt(raw[2] + raw[2], 16)
    if ([r, g, b].some(Number.isNaN)) return null
    return { r, g, b }
  }
  if (raw.length === 6) {
    const r = parseInt(raw.slice(0, 2), 16)
    const g = parseInt(raw.slice(2, 4), 16)
    const b = parseInt(raw.slice(4, 6), 16)
    if ([r, g, b].some(Number.isNaN)) return null
    return { r, g, b }
  }
  return null
}

function rgbToHex({ r, g, b }) {
  const to2 = n => clampInt(n, 0, 255).toString(16).padStart(2, '0')
  return `#${to2(r)}${to2(g)}${to2(b)}`
}

function adjustColor(hex, { darkenRatio = 0, lightenRatio = 0 } = {}) {
  const rgb = parseHexColor(hex)
  if (!rgb) return hex

  if (darkenRatio > 0) {
    return rgbToHex({
      r: rgb.r * (1 - darkenRatio),
      g: rgb.g * (1 - darkenRatio),
      b: rgb.b * (1 - darkenRatio)
    })
  }

  if (lightenRatio > 0) {
    return rgbToHex({
      r: rgb.r + (255 - rgb.r) * lightenRatio,
      g: rgb.g + (255 - rgb.g) * lightenRatio,
      b: rgb.b + (255 - rgb.b) * lightenRatio
    })
  }

  return hex
}

function toProxyImageUrl(imageUrl) {
  if (!imageUrl) return imageUrl
  return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`
}

async function getDarkDominantColorFromImageUrl(
  imageUrl,
  { fallback = '#0060e0', darkenRatio = 0.62, maxSize = 48 } = {}
) {
  try {
    if (!imageUrl || typeof window === 'undefined') {
      return fallback
    }

    const img = new window.Image()

    // 同源代理后不需要 CORS，但保留该设置以兼容允许 CORS 的图源
    img.crossOrigin = 'anonymous'

    const src = toProxyImageUrl(imageUrl)

    const loaded = await new Promise((resolve, reject) => {
      img.onload = () => resolve(true)
      img.onerror = reject
      img.src = src
    })

    if (!loaded) return fallback

    const w = img.naturalWidth || img.width
    const h = img.naturalHeight || img.height
    if (!w || !h) return fallback

    const scale = Math.min(1, maxSize / Math.max(w, h))
    const sw = Math.max(1, Math.floor(w * scale))
    const sh = Math.max(1, Math.floor(h * scale))

    const canvas = document.createElement('canvas')
    canvas.width = sw
    canvas.height = sh

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return fallback

    ctx.drawImage(img, 0, 0, sw, sh)

    const { data } = ctx.getImageData(0, 0, sw, sh)

    let rSum = 0
    let gSum = 0
    let bSum = 0
    let count = 0

    // 采样：跳过过于透明、过于接近白/黑的像素，让结果更稳定
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3]
      if (a < 180) continue

      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b

      // 跳过极端：接近纯白 / 纯黑 / 低饱和的大片灰
      if (luma > 245 || luma < 10) continue
      if (max - min < 8) continue

      rSum += r
      gSum += g
      bSum += b
      count++
    }

    if (count < 30) {
      // 如果过滤太多导致样本不足，就退回不过滤的平均色
      rSum = 0
      gSum = 0
      bSum = 0
      count = 0
      for (let i = 0; i < data.length; i += 16) {
        const a = data[i + 3]
        if (a < 120) continue
        rSum += data[i]
        gSum += data[i + 1]
        bSum += data[i + 2]
        count++
      }
    }

    if (!count) return fallback

    const avg = {
      r: rSum / count,
      g: gSum / count,
      b: bSum / count
    }

    const hex = rgbToHex(avg)
    const darkHex = adjustColor(hex, { darkenRatio })

    return darkHex || fallback
  } catch (e) {
    return fallback
  }
}
