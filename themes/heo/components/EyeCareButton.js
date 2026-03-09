import { Eye, EyeSlash } from '@/components/HeroIcons'
import { useGlobal } from '@/lib/global'
import { useCallback, useEffect, useRef, useState } from 'react'

const MIN_EYE_CARE_INTENSITY = 72
const MAX_EYE_CARE_INTENSITY = 100

export default function EyeCareButton() {
  const {
    isEyeCareMode,
    eyeCareIntensity,
    toggleEyeCareMode,
    setEyeCareIntensity
  } = useGlobal()

  const panelRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const progress = `${((eyeCareIntensity - MIN_EYE_CARE_INTENSITY) / (MAX_EYE_CARE_INTENSITY - MIN_EYE_CARE_INTENSITY)) * 100}%`

  const updateIntensityFromClientX = useCallback(
    clientX => {
      const panel = panelRef.current
      if (!panel || !isEyeCareMode) return

      const rect = panel.getBoundingClientRect()
      if (!rect.width) return

      const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1)
      const nextValue = Math.round(
        MIN_EYE_CARE_INTENSITY + ratio * (MAX_EYE_CARE_INTENSITY - MIN_EYE_CARE_INTENSITY)
      )

      setEyeCareIntensity(nextValue)
    },
    [isEyeCareMode, setEyeCareIntensity]
  )

  useEffect(() => {
    if (!isDragging) return

    const handlePointerMove = e => {
      updateIntensityFromClientX(e.clientX)
    }

    const stopDragging = () => {
      setIsDragging(false)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', stopDragging)
    window.addEventListener('pointercancel', stopDragging)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', stopDragging)
      window.removeEventListener('pointercancel', stopDragging)
    }
  }, [isDragging, updateIntensityFromClientX])

  const handlePanelPointerDown = e => {
    if (!isEyeCareMode) return
    updateIntensityFromClientX(e.clientX)
    setIsDragging(true)
  }

  return (
    <div className={`heo-eye-care-control ${isEyeCareMode ? 'is-enabled' : ''} ${isDragging ? 'is-dragging' : ''}`}>
      <button
        type='button'
        onClick={toggleEyeCareMode}
        aria-label={isEyeCareMode ? '关闭护眼模式' : '开启护眼模式'}
        title={isEyeCareMode ? '关闭护眼模式' : '开启护眼模式'}
        className='heo-header-action-btn'>
        <span className='flex items-center justify-center'>
          {isEyeCareMode ? <EyeSlash /> : <Eye />}
        </span>
      </button>

      <div
        ref={panelRef}
        role='slider'
        tabIndex={isEyeCareMode ? 0 : -1}
        aria-hidden={!isEyeCareMode}
        aria-label='护眼亮度调节'
        aria-valuemin={MIN_EYE_CARE_INTENSITY}
        aria-valuemax={MAX_EYE_CARE_INTENSITY}
        aria-valuenow={eyeCareIntensity}
        onPointerDown={handlePanelPointerDown}
        onKeyDown={e => {
          if (!isEyeCareMode) return
          if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault()
            setEyeCareIntensity(eyeCareIntensity - 1)
          }
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault()
            setEyeCareIntensity(eyeCareIntensity + 1)
          }
          if (e.key === 'Home') {
            e.preventDefault()
            setEyeCareIntensity(MIN_EYE_CARE_INTENSITY)
          }
          if (e.key === 'End') {
            e.preventDefault()
            setEyeCareIntensity(MAX_EYE_CARE_INTENSITY)
          }
        }}
        style={{ '--heo-eye-care-progress': progress }}
        className='heo-eye-care-control__panel'>
        <span className='heo-eye-care-control__label'>亮度</span>
        <span className='heo-eye-care-control__value'>{eyeCareIntensity}%</span>
      </div>
    </div>
  )
}
