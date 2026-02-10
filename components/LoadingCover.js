'use client'
import { useGlobal } from '@/lib/global'
import { useEffect, useState } from 'react'

export default function LoadingCover() {
  const { onLoading, setOnLoading } = useGlobal()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClick = () => {
    setOnLoading(false)
  }

  if (!mounted) {
    return null
  }

  return (
    <div
      id='loading-box'
      onClick={handleClick}
      className={onLoading ? '' : 'loaded'}>
      <div className='loading-bg'></div>
      <div className='loading-animation'>
        <svg
          className='loading'
          viewBox='0 0 1024 1024'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'>
          <path
            pathLength='360'
            className='color'
            d='M320 250 Q300 350 310 450 Q320 550 360 620 L400 750 Q450 820 550 800 Q650 780 700 700 L720 550 Q730 400 680 300 Q630 200 500 180 Q400 170 320 250 Z'
          />
          <path pathLength='360' d='M380 420 Q400 410 420 425' />
          <path pathLength='360' d='M390 440 L410 450' />
          <path
            pathLength='360'
            className='color'
            d='M350 220 Q400 180 480 190'
          />
          <path pathLength='360' d='M500 185 Q580 200 640 250' />
          <path pathLength='360' d='M330 280 Q300 320 290 380' />
          <path pathLength='360' d='M420 780 Q512 850 600 780' />
        </svg>
        <div className='loading-text' data-glitch='Loading'>
          Loading
        </div>
      </div>
    </div>
  )
}
