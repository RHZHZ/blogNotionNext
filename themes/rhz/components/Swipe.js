import { isBrowser } from '@/lib/utils'
import { useEffect, useState } from 'react'

export default function Swipe({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!isBrowser || !items || items.length <= 1) return

    const timer = window.setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % items.length)
    }, 3000)

    return () => window.clearInterval(timer)
  }, [items])

  if (!items || items.length === 0) {
    return null
  }

  const currentItem = items[currentIndex]

  return (
    <a
      href={currentItem?.url}
      className='line-clamp-1 w-full text-center transition-colors duration-200 hover:text-indigo-600 dark:hover:text-amber-300'>
      {currentItem?.title}
    </a>
  )
}
