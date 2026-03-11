import { Eye, EyeSlash } from '@/components/HeroIcons'
import DarkModeButton from '@/components/DarkModeButton'
import { useGlobal } from '@/lib/global'
import { Dialog, Transition } from '@headlessui/react'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import {
  Fragment,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { MenuListSide } from './MenuListSide'
import TagGroups from './TagGroups'

const drawerActionClassName =
  'group flex items-center justify-between rounded-[1.35rem] border border-slate-200/65 bg-white/94 px-3 py-2.5 text-sm font-medium text-slate-700 shadow-[0_6px_16px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/35 dark:border-slate-700/35 dark:bg-slate-900/68 dark:text-slate-100 dark:hover:bg-white/[0.08] dark:focus-visible:ring-amber-400/30'

const drawerSectionTrayClassName =
  'heo-card rounded-[1.45rem] border-slate-200/70 bg-slate-50/58 p-2 dark:border-slate-700/34 dark:bg-slate-900/22'

const MIN_EYE_CARE_INTENSITY = 72
const MAX_EYE_CARE_INTENSITY = 100

/**
 * 侧边抽屉
 * 移动端的菜单在这里
 */
export default function SlideOver(props) {
  const { cRef, tagOptions } = props
  const [open, setOpen] = useState(false)
  const [coverColor, setCoverColor] = useState(null)
  const { locale, isDarkMode, isEyeCareMode, eyeCareIntensity, toggleEyeCareMode, setEyeCareIntensity } = useGlobal()
  const router = useRouter()

  useImperativeHandle(cRef, () => ({
    toggleSlideOvers: toggleSlideOvers
  }))

  const toggleSlideOvers = () => {
    setOpen(!open)
  }

  useEffect(() => {
    const fallbackColor = isDarkMode ? '#F59E0B' : '#2563EB'

    const applyGlobalColor = colorFromEvent => {
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
  }, [isDarkMode])

  useEffect(() => {
    setOpen(false)
  }, [router])

  const accentColor = coverColor || (isDarkMode ? '#F59E0B' : '#2563EB')
  const panelStyle = {
    '--drawer-accent': accentColor,
    borderLeftColor: isDarkMode
      ? 'color-mix(in srgb, var(--drawer-accent) 8%, rgba(255,255,255,0.06))'
      : 'color-mix(in srgb, var(--drawer-accent) 8%, rgba(203,213,225,0.7))',
    boxShadow: isDarkMode
      ? '0 24px 72px rgba(0,0,0,0.38), inset 1px 0 0 rgba(255,255,255,0.03)'
      : '0 24px 80px rgba(15,23,42,0.14), inset 1px 0 0 rgba(255,255,255,0.78)'
  }
  const sectionStyle = {
    borderColor: isDarkMode
      ? 'rgba(71,85,105,0.28)'
      : 'rgba(203,213,225,0.72)',
    background: isDarkMode ? 'rgba(15,23,42,0.28)' : 'rgba(255,255,255,0.88)',
    boxShadow: isDarkMode ? 'none' : '0 10px 28px rgba(15,23,42,0.05)'
  }
  const sectionTitleStyle = {
    color: isDarkMode
      ? '#94A3B8'
      : 'color-mix(in srgb, var(--drawer-accent) 18%, #94A3B8)'
  }
  const heroStyle = {
    borderColor: isDarkMode
      ? 'rgba(71,85,105,0.56)'
      : 'rgba(203,213,225,0.68)',
    background: isDarkMode
      ? 'linear-gradient(135deg, rgba(30,41,59,0.94), rgba(30,41,59,0.82))'
      : 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.94))'
  }
  const actionSectionStyle = {
    ...sectionStyle,
    boxShadow: 'none'
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-30' onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter='ease-in-out duration-500'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in-out duration-500'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <div className='fixed inset-0 bg-slate-950/42 backdrop-blur-md transition-opacity dark:bg-black/60' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-hidden'>
          <div className='absolute inset-0 overflow-hidden'>
            <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10'>
              <Transition.Child
                as={Fragment}
                enter='transform transition ease-[cubic-bezier(0.22,1,0.36,1)] duration-500 sm:duration-700'
                enterFrom='translate-x-full opacity-0 scale-[0.985]'
                enterTo='translate-x-0 opacity-100 scale-100'
                leave='transform transition ease-in-out duration-400 sm:duration-500'
                leaveFrom='translate-x-0 opacity-100 scale-100'
                leaveTo='translate-x-full opacity-0 scale-[0.99]'>
                <Dialog.Panel className='pointer-events-auto relative w-[92vw] max-w-md origin-right will-change-transform'>
                  <div
                    style={panelStyle}
                    className='flex h-full flex-col overflow-hidden rounded-l-[2rem] border-l bg-gradient-to-b from-[#f8fafc] via-[#f8fafc] to-[#eef2f7] py-4 backdrop-blur-2xl dark:from-[#0f172a] dark:via-[#111827] dark:to-[#0b1120]'>
                    <div className='px-5 pb-4 pt-2'>
                      <div
                        style={heroStyle}
                        className='heo-card rounded-[1.75rem] px-4 py-4'>
                        <div className='flex items-start justify-between gap-3'>
                          <div className='min-w-0'>
                            <div
                              style={sectionTitleStyle}
                              className='text-[11px] font-semibold uppercase tracking-[0.28em]'>
                              HEO MENU
                            </div>
                            <div className='mt-2 truncate text-lg font-bold text-slate-800 dark:text-white'>
                              {locale.COMMON.BLOG}
                            </div>
                          </div>
                          <button
                            type='button'
                            className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-200/70 bg-white/92 text-slate-500 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/35 dark:border-slate-700/40 dark:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-700/70 dark:hover:text-slate-100 dark:focus-visible:ring-amber-400/30'
                            onClick={() => setOpen(false)}>
                            <span className='sr-only'>Close panel</span>
                            <i className='fa-solid fa-xmark text-base'></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className='mx-5 mb-4 space-y-3'>
                      <div className='grid grid-cols-2 gap-3'>
                        <DarkModeBlockButton accentColor={accentColor} isDarkMode={isDarkMode} />
                        <EyeCareBlockButton
                          accentColor={accentColor}
                          isDarkMode={isDarkMode}
                          isEyeCareMode={isEyeCareMode}
                          toggleEyeCareMode={toggleEyeCareMode}
                        />
                      </div>
                      {isEyeCareMode && (
                        <EyeCareIntensityCapsule
                          accentColor={accentColor}
                          isDarkMode={isDarkMode}
                          isEyeCareMode={isEyeCareMode}
                          eyeCareIntensity={eyeCareIntensity}
                          setEyeCareIntensity={setEyeCareIntensity}
                        />
                      )}
                    </div>

                    <div className='flex-1 overflow-y-auto px-5 pb-6 dark:text-white'>
                      <section className='space-y-3'>
                        <div
                          style={sectionTitleStyle}
                          className='px-1 text-[11px] font-semibold uppercase tracking-[0.24em]'>
                          Quick Access
                        </div>
                        <div className='grid grid-cols-2 gap-3'>
                          <Button title={'主页'} url={'/'} icon='fas fa-house' accentColor={accentColor} isDarkMode={isDarkMode} />
                          <Button title={'关于'} url={'/about'} icon='fas fa-circle-info' accentColor={accentColor} isDarkMode={isDarkMode} />
                        </div>
                      </section>

                      <section className='mt-5 space-y-3'>
                        <div
                          style={sectionTitleStyle}
                          className='px-1 text-[11px] font-semibold uppercase tracking-[0.24em]'>
                          Navigation
                        </div>
                        <div
                          style={actionSectionStyle}
                          className={drawerSectionTrayClassName}>
                          <MenuListSide {...props} accentColor={accentColor} isDarkMode={isDarkMode} />
                        </div>
                      </section>

                      <section className='mt-5 space-y-3'>
                        <div
                          style={sectionTitleStyle}
                          className='px-1 text-[11px] font-semibold uppercase tracking-[0.24em]'>
                          {locale.COMMON.TAGS}
                        </div>
                        <div
                          style={actionSectionStyle}
                          className={`${drawerSectionTrayClassName} px-2.5 py-2.5`}>
                          <TagGroups tags={tagOptions} accentColor={accentColor} isDarkMode={isDarkMode} />
                        </div>
                      </section>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

function DarkModeBlockButton({ accentColor, isDarkMode }) {
  const darkModeRef = useRef()
  const { isDarkMode: currentDarkMode, locale } = useGlobal()

  function handleChangeDarkMode() {
    darkModeRef?.current?.handleChangeDarkMode()
  }

  const iconStyle = {
    background: currentDarkMode
      ? isDarkMode
        ? `color-mix(in srgb, ${accentColor} 26%, rgba(255,255,255,0.12))`
        : `color-mix(in srgb, ${accentColor} 18%, #EFF6FF)`
      : isDarkMode
        ? `color-mix(in srgb, ${accentColor} 10%, rgba(255,255,255,0.08))`
        : `color-mix(in srgb, ${accentColor} 8%, #F8FAFC)`,
    color: currentDarkMode
      ? isDarkMode
        ? '#FCD34D'
        : `color-mix(in srgb, ${accentColor} 60%, #1D4ED8)`
      : isDarkMode
        ? `color-mix(in srgb, ${accentColor} 35%, #E2E8F0)`
        : `color-mix(in srgb, ${accentColor} 30%, #475569)`
  }

  return (
    <button
      onClick={handleChangeDarkMode}
      className={`${drawerActionClassName} ${currentDarkMode ? 'border-blue-200/80 bg-blue-50/95 text-blue-700 shadow-[0_12px_28px_rgba(37,99,235,0.14)] dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100 dark:shadow-[0_12px_28px_rgba(245,158,11,0.14)]' : ''}`}>
      <span className='flex items-center gap-3'>
        <span
          style={iconStyle}
          className='flex h-9 w-9 items-center justify-center rounded-[1.1rem] transition-colors duration-300'>
          <DarkModeButton cRef={darkModeRef} className='group-hover:text-current' />
        </span>
        <span>{currentDarkMode ? locale.MENU.LIGHT_MODE : locale.MENU.DARK_MODE}</span>
      </span>
      <i className={`fas fa-angle-right text-xs transition-transform duration-300 group-hover:translate-x-0.5 ${currentDarkMode ? 'text-blue-500 dark:text-amber-300' : 'text-slate-400'}`}></i>
    </button>
  )
}



function EyeCareBlockButton({ accentColor, isDarkMode, isEyeCareMode, toggleEyeCareMode }) {
  const emitModeToast = message => {
    if (typeof window === 'undefined' || !message) return
    window.dispatchEvent(new CustomEvent('heo-mode-toast', { detail: { message } }))
  }

  const iconStyle = {
    background: isEyeCareMode
      ? isDarkMode
        ? `color-mix(in srgb, ${accentColor} 26%, rgba(255,255,255,0.12))`
        : `color-mix(in srgb, ${accentColor} 18%, #EFF6FF)`
      : isDarkMode
        ? `color-mix(in srgb, ${accentColor} 10%, rgba(255,255,255,0.08))`
        : `color-mix(in srgb, ${accentColor} 8%, #F8FAFC)`,
    color: isEyeCareMode
      ? isDarkMode
        ? '#FCD34D'
        : `color-mix(in srgb, ${accentColor} 60%, #1D4ED8)`
      : isDarkMode
        ? `color-mix(in srgb, ${accentColor} 35%, #E2E8F0)`
        : `color-mix(in srgb, ${accentColor} 30%, #475569)`
  }

  const handleToggleEyeCareMode = () => {
    const nextStatus = !isEyeCareMode
    toggleEyeCareMode()
    emitModeToast(nextStatus ? '护眼模式已经替你点亮了，可以慢慢拖到刚刚好的力度' : '护眼模式先轻轻退下了，调节面板也一起安静收起了')
  }

  return (
    <button
      type='button'
      onClick={handleToggleEyeCareMode}
      className={`${drawerActionClassName} ${isEyeCareMode ? 'border-blue-200/80 bg-blue-50/95 text-blue-700 shadow-[0_12px_28px_rgba(37,99,235,0.14)] dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100 dark:shadow-[0_12px_28px_rgba(245,158,11,0.14)]' : ''}`}>
      <span className='flex items-center gap-3'>
        <span
          style={iconStyle}
          className='flex h-9 w-9 items-center justify-center rounded-[1.1rem] transition-colors duration-300'>
          {isEyeCareMode ? <EyeSlash /> : <Eye />}
        </span>
        <span>{isEyeCareMode ? '关闭护眼' : '开启护眼'}</span>
      </span>
      <i className={`fas fa-angle-right text-xs transition-transform duration-300 group-hover:translate-x-0.5 ${isEyeCareMode ? 'text-blue-500 dark:text-amber-300' : 'text-slate-400'}`}></i>
    </button>
  )
}

function EyeCareIntensityCapsule({ accentColor, isDarkMode, isEyeCareMode, eyeCareIntensity, setEyeCareIntensity }) {
  const capsuleRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isSettling, setIsSettling] = useState(false)
  const activeRatio = Math.min(
    1,
    Math.max(0, (eyeCareIntensity - MIN_EYE_CARE_INTENSITY) / (MAX_EYE_CARE_INTENSITY - MIN_EYE_CARE_INTENSITY))
  )
  const displayValue = isEyeCareMode ? `${eyeCareIntensity}%` : 'OFF'
  const fillPercent = isEyeCareMode ? `${Math.max(activeRatio * 100, 8)}%` : '0%'

  const updateIntensityFromClientX = useCallback(
    clientX => {
      if (!isEyeCareMode) return
      const capsule = capsuleRef.current
      if (!capsule) return
      const rect = capsule.getBoundingClientRect()
      if (!rect.width) return
      const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1)
      const nextValue = Math.round(MIN_EYE_CARE_INTENSITY + ratio * (MAX_EYE_CARE_INTENSITY - MIN_EYE_CARE_INTENSITY))
      setEyeCareIntensity(nextValue)
    },
    [isEyeCareMode, setEyeCareIntensity]
  )

  useEffect(() => {
    if (!isDragging) return

    const handlePointerMove = event => {
      updateIntensityFromClientX(event.clientX)
    }

    const stopDragging = () => {
      setIsDragging(false)
      setIsSettling(true)
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

  useEffect(() => {
    if (isEyeCareMode) return
    setIsDragging(false)
    setIsSettling(false)
  }, [isEyeCareMode])

  const fillStyle = {
    width: fillPercent,
    background: isDarkMode
      ? `linear-gradient(135deg, color-mix(in srgb, ${accentColor} 42%, #F59E0B), color-mix(in srgb, ${accentColor} 18%, #FDE68A) 54%, color-mix(in srgb, ${accentColor} 24%, #FCD34D))`
      : `linear-gradient(135deg, color-mix(in srgb, ${accentColor} 58%, #60A5FA), color-mix(in srgb, ${accentColor} 24%, #DBEAFE) 52%, color-mix(in srgb, ${accentColor} 34%, #EFF6FF))`,
    boxShadow: isDarkMode
      ? 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -6px 14px rgba(120,53,15,0.16), 0 6px 18px rgba(245,158,11,0.08)'
      : 'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -8px 14px rgba(37,99,235,0.08), 0 8px 18px rgba(59,130,246,0.08)',
    opacity: isEyeCareMode ? 1 : 0,
    borderTopRightRadius: '999px',
    borderBottomRightRadius: '999px',
    transform: isDragging ? 'scaleY(1.01)' : isSettling ? 'scaleY(0.992)' : 'scaleY(1)'
  }

  const capsuleStyle = {
    background: isDarkMode
      ? 'linear-gradient(180deg, rgba(15,23,42,0.96), rgba(30,41,59,0.88))'
      : 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(241,245,249,0.96))',
    borderColor: isEyeCareMode
      ? isDarkMode
        ? 'rgba(245, 158, 11, 0.18)'
        : 'rgba(96, 165, 250, 0.18)'
      : isDarkMode
        ? 'rgba(71, 85, 105, 0.34)'
        : 'rgba(203, 213, 225, 0.9)',
    boxShadow: isDarkMode
      ? 'inset 0 1px 0 rgba(255,255,255,0.04), 0 12px 28px rgba(0,0,0,0.22)'
      : 'inset 0 1px 0 rgba(255,255,255,0.65), 0 12px 28px rgba(15,23,42,0.08)'
  }

  const thumbStyle = {
    left: fillPercent,
    background: isDarkMode
      ? 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(254,243,199,0.92))'
      : 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(239,246,255,0.96))',
    boxShadow: isDarkMode
      ? '0 8px 22px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.82)'
      : '0 10px 24px rgba(37,99,235,0.14), inset 0 1px 0 rgba(255,255,255,0.95)',
    opacity: isEyeCareMode ? 1 : 0,
    transform: `translateX(-50%) scale(${isDragging ? 1.06 : isSettling ? 0.96 : 1})`
  }

  return (
    <div className='overflow-hidden rounded-[1.6rem] border px-3.5 py-3 transition-all duration-300' style={{ ...capsuleStyle, opacity: isEyeCareMode ? 1 : 0.84 }}>
      <div className='mb-2.5 flex items-center justify-between gap-3'>
        <div className='min-w-0'>
          <div className='text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500'>Eye Care</div>
          <div className='mt-1 text-sm font-semibold text-slate-700 dark:text-slate-100'>护眼力度</div>
        </div>
        <div className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isEyeCareMode ? 'bg-blue-100/75 text-blue-700 dark:bg-amber-400/12 dark:text-amber-200' : 'bg-slate-200/80 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
          {displayValue}
        </div>
      </div>

      <div
        ref={capsuleRef}
        role='slider'
        tabIndex={isEyeCareMode ? 0 : -1}
        aria-hidden={!isEyeCareMode}
        aria-label='护眼力度调节'
        aria-valuemin={MIN_EYE_CARE_INTENSITY}
        aria-valuemax={MAX_EYE_CARE_INTENSITY}
        aria-valuenow={eyeCareIntensity}
        aria-valuetext={displayValue}
        onPointerDown={event => {
          if (!isEyeCareMode) return
          setIsSettling(false)
          updateIntensityFromClientX(event.clientX)
          setIsDragging(true)
        }}
        onKeyDown={event => {
          if (!isEyeCareMode) return
          if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
            event.preventDefault()
            setEyeCareIntensity(eyeCareIntensity - 1)
          }
          if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            event.preventDefault()
            setEyeCareIntensity(eyeCareIntensity + 1)
          }
          if (event.key === 'Home') {
            event.preventDefault()
            setEyeCareIntensity(MIN_EYE_CARE_INTENSITY)
          }
          if (event.key === 'End') {
            event.preventDefault()
            setEyeCareIntensity(MAX_EYE_CARE_INTENSITY)
          }
        }}
        className={`relative h-14 overflow-hidden rounded-full border transition-all duration-300 ${isEyeCareMode ? 'cursor-ew-resize border-transparent' : 'cursor-not-allowed border-slate-200/80 dark:border-slate-700/50'}`}>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.32),transparent_54%)] opacity-70' />
        <div className='absolute inset-[1px] rounded-full bg-white/10 dark:bg-white/[0.03]' />
        <div
          className='absolute inset-y-0 left-0 transition-[width,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]'
          style={fillStyle}>
          <div className='absolute inset-0 rounded-r-full bg-[radial-gradient(circle_at_24%_24%,rgba(255,255,255,0.32),transparent_34%),radial-gradient(circle_at_70%_74%,rgba(255,255,255,0.12),transparent_34%)] opacity-80' />
          <div className={`absolute inset-y-[22%] left-[10%] right-[18%] rounded-full bg-white/12 blur-md transition-transform duration-500 ${isDragging ? 'translate-x-2' : isSettling ? '-translate-x-1' : 'translate-x-0'}`} />
          <div className={`absolute -right-5 top-1/2 h-12 w-10 -translate-y-1/2 rounded-full bg-white/18 blur-lg transition-all duration-500 ${isDragging ? 'opacity-80 scale-105' : isSettling ? 'opacity-45 scale-95' : 'opacity-55 scale-100'}`} />
        </div>
        <div
          className='absolute top-1/2 z-[1] h-9 w-9 rounded-full border border-white/45 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]'
          style={thumbStyle}
        />
        <div className='absolute inset-0 rounded-full ring-1 ring-inset ring-white/18 dark:ring-white/5' />
        <div className='absolute inset-y-0 left-0 right-0 z-[2] flex items-center justify-between px-4 text-[0.72rem] font-semibold tracking-[0.08em] text-slate-600 dark:text-slate-200'>
          <span>{isEyeCareMode ? '拖动调节' : '护眼已关闭'}</span>
          <span>{isEyeCareMode ? '' : displayValue}</span>
        </div>
      </div>

      <div className='mt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500'>
        <span>柔和</span>
        <span>{isEyeCareMode ? '慢慢拖动就好' : '开启后可拖动'}</span>
        <span>更深</span>
      </div>
    </div>
  )
}

function Button({ title, url, icon, accentColor, isDarkMode }) {
  const iconStyle = {
    background: isDarkMode
      ? `color-mix(in srgb, ${accentColor} 10%, rgba(255,255,255,0.08))`
      : `color-mix(in srgb, ${accentColor} 8%, #F8FAFC)`,
    color: isDarkMode
      ? `color-mix(in srgb, ${accentColor} 35%, #E2E8F0)`
      : `color-mix(in srgb, ${accentColor} 30%, #475569)`
  }

  return (
    <SmartLink
      href={url}
      className={drawerActionClassName}>
      <span className='flex min-w-0 items-center gap-3'>
        <span
          style={iconStyle}
          className='flex h-8.5 w-8.5 flex-shrink-0 items-center justify-center rounded-[1rem] transition-colors duration-300'>
          <i className={icon}></i>
        </span>
        <span className='truncate'>{title}</span>
      </span>
      <i className='fas fa-angle-right text-xs text-slate-400 transition-transform duration-300 group-hover:translate-x-0.5'></i>
    </SmartLink>
  )
}
