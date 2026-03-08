import styles from './AISummary.module.css'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useGlobal } from '@/lib/global'
import { isAiSummaryEnabled, isValidAiSummary } from '@/lib/utils'
import { countWords } from '@/lib/plugins/wordCount'

const DESKTOP_COLLAPSE_LINES = 5
const MOBILE_COLLAPSE_LINES = 4

const AISummary = ({ aiSummary, post }) => {
  const { locale, isDarkMode } = useGlobal()
  const [summary, setSummary] = useState(aiSummary)
  const [showStats, setShowStats] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [coverColor, setCoverColor] = useState(null)
  const [shouldCollapse, setShouldCollapse] = useState(false)
  const summaryRef = useRef(null)
  const contentRef = useRef(null)
  const aiSummaryEnabled = isAiSummaryEnabled(post)
  const shouldRender = aiSummaryEnabled && isValidAiSummary(aiSummary)

  // 读取全局取色变量，与 PostHeader / InfoCard 联动
  useEffect(() => {
    const fallbackColor = isDarkMode ? '#CA8A04' : '#0060e0'

    const applyGlobalColor = (colorFromEvent) => {
      if (typeof window === 'undefined') {
        setCoverColor(fallbackColor)
        return
      }

      const rootColor =
        colorFromEvent ||
        window.getComputedStyle(document.documentElement)
          .getPropertyValue('--heo-cover-color')
          .trim()

      setCoverColor(rootColor || fallbackColor)
    }

    applyGlobalColor()

    const onColorChange = event => {
      applyGlobalColor(event?.detail?.color)
    }

    window.addEventListener('heo-cover-color-change', onColorChange)

    return () => {
      window.removeEventListener('heo-cover-color-change', onColorChange)
    }
  }, [post?.id, isDarkMode])

  useEffect(() => {
    showAiSummaryAnimation(aiSummary, setSummary)
  }, [aiSummary])

  useEffect(() => {
    setExpanded(false)
  }, [post?.id, aiSummary])

  const measureCollapseState = useCallback(() => {
    if (typeof window === 'undefined') return

    const contentEl = contentRef.current
    if (!contentEl || !aiSummary) {
      setShouldCollapse(false)
      return
    }

    const computedStyle = window.getComputedStyle(contentEl)
    const lineHeight = parseFloat(computedStyle.lineHeight)

    if (!lineHeight) {
      setShouldCollapse(false)
      return
    }

    const maxLines = window.innerWidth <= 768 ? MOBILE_COLLAPSE_LINES : DESKTOP_COLLAPSE_LINES
    const totalLines = Math.round(contentEl.scrollHeight / lineHeight)

    setShouldCollapse(totalLines > maxLines)
  }, [aiSummary])

  useEffect(() => {
    measureCollapseState()
  }, [measureCollapseState, summary, expanded])

  useEffect(() => {
    if (typeof window === 'undefined') return

    let frameId = 0
    const handleResize = () => {
      cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(measureCollapseState)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [measureCollapseState])

  const calculateStats = () => {
    if (!aiSummary) return null

    const originalLength = Number(post?.wordCount) || 0
    const summaryLength = countWords(aiSummary).wordCount
    const ratio = originalLength > 0 ? (1 - summaryLength / originalLength) * 100 : 0
    const compressionRatio = Math.max(0, ratio).toFixed(1)

    return {
      originalLength,
      summaryLength,
      compressionRatio
    }
  }

  const stats = calculateStats()

  const handleToggleStats = () => {
    setShowStats(prev => {
      const next = !prev
      if (next && shouldCollapse && !expanded) {
        setExpanded(true)
      }
      return next
    })
  }

  if (!shouldRender) {
    return null
  }

  return (
    <div
      ref={summaryRef}
      className={styles['post-ai']}
      style={{ '--cover-color': coverColor }}>
        <div className={styles['ai-glow']} aria-hidden='true' />

        <div className={styles['ai-container']}>
          <div className={styles['ai-header']}>
            <div className={styles['ai-identity']}>
              <div className={styles['ai-icon']}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  width='24'
                  height='24'>
                  <path
                    fill='currentColor'
                    d='M12,2A2,2 0 0,1 14,4V5H18A2,2 0 0,1 20,7V19A2,2 0 0,1 18,21H6A2,2 0 0,1 4,19V7A2,2 0 0,1 6,5H10V4A2,2 0 0,1 12,2M8,11A1.5,1.5 0 0,0 6.5,12.5A1.5,1.5 0 0,0 8,14A1.5,1.5 0 0,0 9.5,12.5A1.5,1.5 0 0,0 8,11M16,11A1.5,1.5 0 0,0 14.5,12.5A1.5,1.5 0 0,0 16,14A1.5,1.5 0 0,0 17.5,12.5A1.5,1.5 0 0,0 16,11M7,17H17V15H7V17Z'
                  />
                </svg>
              </div>
              <div className={styles['ai-heading']}>
                <div className={styles['ai-title']}>{locale.AI_SUMMARY.NAME}</div>
                <div className={styles['ai-subtitle']}>智能提炼核心观点与价值</div>
              </div>
            </div>

            <div className={styles['ai-actions']}>
              <div className={styles['ai-tag']}>RHZ-Claude</div>
              {stats && (
                <button
                  onClick={handleToggleStats}
                  className={styles['ai-stats-btn']}
                  aria-label='显示摘要统计信息'>
                  {showStats ? '收起数据' : '查看数据'}
                </button>
              )}
            </div>
          </div>

          <div className={styles['ai-content']}>
            <div
              ref={contentRef}
              className={`${styles['ai-explanation']} ${
                shouldCollapse && !expanded ? styles['collapsed'] : ''
              }`}>
              {summary}
              {summary !== aiSummary && (
                <span className={styles['blinking-cursor']}></span>
              )}
            </div>

            {shouldCollapse && !expanded && !showStats && <div className={styles['ai-fade-mask']} aria-hidden='true' />}

            {shouldCollapse && (
              <div className={styles['ai-expand-wrap']}>
                <button
                  type='button'
                  onClick={() => setExpanded(v => !v)}
                  className={styles['ai-expand-btn']}>
                  {expanded ? '收起摘要' : '展开摘要'}
                </button>
              </div>
            )}

            {showStats && stats && (
              <div className={styles['ai-stats']}>
                <div className={styles['stat-item']}>
                  <span className={styles['stat-label']}>原文</span>
                  <span className={styles['stat-value']}>{stats.originalLength} 字</span>
                </div>
                <div className={styles['stat-item']}>
                  <span className={styles['stat-label']}>摘要</span>
                  <span className={styles['stat-value']}>{stats.summaryLength} 字</span>
                </div>
                <div className={styles['stat-item']}>
                  <span className={styles['stat-label']}>压缩率</span>
                  <span className={styles['stat-value']}>{stats.compressionRatio}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  )
}

const showAiSummaryAnimation = (rawSummary, setSummary) => {
  if (!rawSummary) return
  let currentIndex = 0
  const typingDelay = 20
  const punctuationDelayMultiplier = 6
  let animationRunning = true
  let lastUpdateTime = performance.now()
  const animate = () => {
    if (currentIndex < rawSummary.length && animationRunning) {
      const currentTime = performance.now()
      const timeDiff = currentTime - lastUpdateTime

      const letter = rawSummary.slice(currentIndex, currentIndex + 1)
      const isPunctuation = /[，。！、？,.!?]/.test(letter)
      const delay = isPunctuation
        ? typingDelay * punctuationDelayMultiplier
        : typingDelay

      if (timeDiff >= delay) {
        setSummary(rawSummary.slice(0, currentIndex + 1))
        lastUpdateTime = currentTime
        currentIndex++

        if (currentIndex < rawSummary.length) {
          setSummary(rawSummary.slice(0, currentIndex))
        } else {
          setSummary(rawSummary)
          observer.disconnect()
        }
      }
      requestAnimationFrame(animate)
    }
  }
  animate(rawSummary)
  const observer = new IntersectionObserver(
    entries => {
      animationRunning = entries[0].isIntersecting
      if (animationRunning && currentIndex === 0) {
        setTimeout(() => {
          requestAnimationFrame(animate)
        }, 200)
      }
    },
    { threshold: 0 }
  )
  let post_ai = document.querySelector('.post-ai')
  if (post_ai) {
    observer.observe(post_ai)
  }
}

export default AISummary
