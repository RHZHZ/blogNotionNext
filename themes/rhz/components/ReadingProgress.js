import { ArrowSmallUp } from '@/components/HeroIcons'
import { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [scrollPercentage, setScrollPercentage] = useState(0)

  function handleScroll() {
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = document.documentElement.clientHeight
    const scrollY = window.scrollY || window.pageYOffset

    const percent = Math.floor((scrollY / (scrollHeight - clientHeight - 20)) * 100)
    setScrollPercentage(percent)
  }

  useEffect(() => {
    let requestId

    function updateScrollPercentage() {
      handleScroll()
      requestId = null
    }

    function handleAnimationFrame() {
      if (requestId) {
        return
      }
      requestId = requestAnimationFrame(updateScrollPercentage)
    }

    handleScroll()
    window.addEventListener('scroll', handleAnimationFrame)
    return () => {
      window.removeEventListener('scroll', handleAnimationFrame)
      if (requestId) {
        cancelAnimationFrame(requestId)
      }
    }
  }, [])

  if (scrollPercentage <= 0) {
    return null
  }

  return (
    <button
      type='button'
      title='阅读进度'
      aria-label='回到顶部'
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className='heo-header-action-btn heo-reading-progress is-visible'>
      <span className='heo-reading-progress__value'>
        {scrollPercentage < 100 ? scrollPercentage : <ArrowSmallUp className='heo-reading-progress__arrow' />}
      </span>
      <span className='heo-reading-progress__icon'>
        <ArrowSmallUp className='heo-reading-progress__arrow' />
      </span>
    </button>
  )
}
